import { Component, Input, Output, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';

import { MaterialDateRangeComponent } from '@components/ui/date-range/material-date-range/material-date-range.component';
import { DropdownItemPickerComponent } from '@components/ui/dropdown-item-picker/dropdown-item-picker.component';
import { DropdownItemPickerModel } from '@components/ui/dropdown-item-picker/dropdown-item-picker.model';
import { DropdownItemMultiPickerComponent } from '@components/ui/dropdown-item-multi-picker/dropdown-item-multi-picker.component';
import { DropdownItemMultiPickerModel } from '@components/ui/dropdown-item-multi-picker/dropdown-item-multi-picker.model';
import { DateRangeDataModel } from '@components/ui/date-range/date-range.model';

import { DateRangeType } from '@enums/date-range-type.enum';

import { ReconciliationSourceTypesDto, ReconciliationSourceTypesService, ReconciliationSourceDto } from '@rest/reconciliation-source-types';

import { ReconciliationBaseModel } from './../shared/reconciliation-base.model';

@Component({
	selector: 'reconciliation-form',
	templateUrl: './form.html',
	styleUrls: ['./form.scss'],
	providers: [ReconciliationSourceTypesService]
})

export class ReconciliationFormComponent implements OnInit {
	@ViewChild(MaterialDateRangeComponent, {static: true}) dateRange: MaterialDateRangeComponent;
	@ViewChild('sourceApplications', {static: true}) sourceApplications: DropdownItemMultiPickerComponent;
	@ViewChild('eventTypes', {static: true}) eventTypes: DropdownItemPickerComponent;

	@Output() changed = new EventEmitter<DateRangeDataModel>();

	@Input() loading = false;

	sourceApplicationSubj = new Subject<DropdownItemMultiPickerModel[]>();

	defaultFormParams: ReconciliationBaseModel = null;
	params: ReconciliationBaseModel = null;

	items: ReconciliationSourceDto[] = [];

	dataRangeType = DateRangeType;

	dates = new DateRangeDataModel();
	defaultDates = DateRangeType.getDateRangeData(DateRangeType.LAST_24HOURS);

	isDisabledEventTypesDropdown: boolean;

	exclude = [
		DateRangeType.LAST_3HOURS,
		DateRangeType.LAST_12MONTHS,
		DateRangeType.LAST_HOUR
	];

	timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	constructor(
		private route: ActivatedRoute,
		private reconciliationSourceTypesService: ReconciliationSourceTypesService
	) {
		this.isDisabledEventTypesDropdown = true;
		this.configData();
	}

	ngOnInit() {
		this.initReconciliationSourceTypes();
	}

	submit() {
		this.changed.emit();
	}

	applyDates(dates: DateRangeDataModel) {
		this.params.dateRange = dates.dateRange;
		this.params.dateFrom = dates.dateFrom;
		this.params.dateTo = dates.dateTo;
	}

	reset() {
		this.resetDateRange();
		this.resetSourceApplication();
		this.resetEventType();
		this.params = Object.assign({}, this.defaultFormParams);
		this.submit();
	}

	configData() {
		const params = this.route.snapshot.queryParams;
		const dateRange = params.dateRange || this.defaultDates.dateRange;
		const dates = DateRangeType.getDateRangeData(dateRange);
		this.dates.dateRange = dates.dateRange || params.dateRange;
		this.dates.dateFrom = dates.dateFrom || params.dateFrom;
		this.dates.dateTo = dates.dateTo || params.dateTo;
		const withDiscrepancy = params && params.withDiscrepancy === 'true';
		this.defaultFormParams = this.getDefaultParams();
		this.params = Object.assign({}, this.defaultFormParams, params, { ...this.dates }, { withDiscrepancy });
	}

	eventTypeChanged(val: DropdownItemPickerModel) {
		if(!val.value) {
			this.params.eventType = null;
			return;
		}

		this.params.eventType = val.name;
	}

	sourceApplicationChanged(sourceApps: DropdownItemMultiPickerModel[]) {
		this.params.sourceApplication = sourceApps.length ? sourceApps.map(source => source.name) : null;
		this.composeEventTypes();
	}

	private getDefaultParams() {
		return new ReconciliationBaseModel({
			page: 1,
			dateRange: this.defaultDates.dateRange,
			dateFrom: this.defaultDates.dateRange === DateRangeType.CUSTOM ? this.defaultDates.dateFrom : null,
			dateTo: this.defaultDates.dateRange === DateRangeType.CUSTOM ? this.defaultDates.dateTo : null,
			withDiscrepancy: false
		});
	}

	private resetDateRange() {
		if(!this.dateRange) {
			return;
		}
		this.dateRange.reset();
	}

	private resetSourceApplication() {
		if(!this.sourceApplications) {
			return;
		}
		this.sourceApplications.reset();
	}

	private resetEventType() {
		if(!this.eventTypes) {
			return;
		}

		this.params.eventType = null;
		this.eventTypes.removeItems();
	}

	private initReconciliationSourceTypes() {
		this.reconciliationSourceTypesService
			.getList()
			.subscribe(
				(resp: ReconciliationSourceTypesDto[]) => {
					this.composeSourceApplicationsData(resp);
					this.composeEventTypes();
				}
			);
	}

	private reduceSourceData(previous: ReconciliationSourceDto[], current: ReconciliationSourceTypesDto) {
		const sourceApplicationExists = previous.find(item => item.name === current.sourceApplication);

		if(sourceApplicationExists) {
			const eventId = current.eventId;
			sourceApplicationExists.eventTypes.push(eventId);
			return previous;
		}

		const source = new ReconciliationSourceDto({
			name: current.sourceApplication,
			eventTypes: [current.eventId]
		});

		previous.push(source);
		return previous;
	}

	private composeSourceApplicationsData(resp: ReconciliationSourceTypesDto[]) {
		const sourceApplicationParams = this.convertSourceApplicationsParams();

		this.items = resp.reduce(this.reduceSourceData, []);

		const sourceApplications = this.items.map(source => {
			const isSourceSelected = sourceApplicationParams.some(item => item.name === source.name);
			const dropdownItem = new DropdownItemMultiPickerModel({
				name: source.name,
				value: { name: source.name },
				checked: isSourceSelected
			});

			return dropdownItem;
		});

		this.sourceApplicationSubj.next(sourceApplications);
		this.sourceApplicationSubj.complete();
	}

	private composeEventTypes() {
		const sourceApplicationParams = this.convertSourceApplicationsParams();
		const isOneSelected = sourceApplicationParams.length === 1;

		if(!isOneSelected) {
			this.isDisabledEventTypesDropdown = true;
			this.resetEventType();
			return;
		}

		this.isDisabledEventTypesDropdown = false;
		const selectedSourceApplication = this.items.find(source => source.name === sourceApplicationParams[0].name);
		const eventTypesList = selectedSourceApplication.eventTypes.map(eventType => {
			return new DropdownItemPickerModel({
				name: eventType,
				value: { name: eventType },
				checked: eventType === this.params.eventType
			});
		});

		this.eventTypes.composeData(eventTypesList);
	}

	private convertSourceApplicationsParams(): ReconciliationSourceDto[] {
		if(!this.params.sourceApplication) {
			return [];
		}

		const sourceApplications = typeof this.params.sourceApplication === 'string' ?
			[this.params.sourceApplication] :
			this.params.sourceApplication;

		return sourceApplications.map(source => new ReconciliationSourceDto({ name: source }));
	}
}
