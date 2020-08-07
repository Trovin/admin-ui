import {
	Component,
	Input,
	Output,
	OnInit,
	ViewChild,
	EventEmitter
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';

import { MaterialDateRangeComponent } from '@components/ui/date-range/material-date-range/material-date-range.component';
import { DropdownItemPickerComponent } from '@components/ui/dropdown-item-picker/dropdown-item-picker.component';
import { DropdownItemPickerModel } from '@components/ui/dropdown-item-picker/dropdown-item-picker.model';
import { DropdownItemMultiPickerComponent } from '@components/ui/dropdown-item-multi-picker/dropdown-item-multi-picker.component';
import { DropdownItemMultiPickerModel, DropdownItemMultiPickerValueModel } from '@components/ui/dropdown-item-multi-picker/dropdown-item-multi-picker.model';
import { DateRangeDataModel } from '@components/ui/date-range/date-range.model';

import { DateRangeColumnType } from '@enums/date-range-column-type.enum';
import { PipelineProcessType } from '@enums/pipeline-process-type.enum';
import { AuditSearchType } from '@enums/audit-search-type.enum';
import { DateRangeType } from '@enums/date-range-type.enum';
import { PipelineType } from '@enums/pipeline-type.enum';

import { SourceApplicationDto, SourceApplicationsService } from '@rest/source-applications';
import { EventTypesService, EventTypesQueriesDto, EventTypesDto } from '@rest/event-types';

import { AuditStatsBaseFormModel } from './form.model';


interface SearchOptionsModel {
	name: string;
	value: number|string;
	checked: boolean;
}

interface SearchOptionsModeModel {
	name: string;
	value: boolean;
	checked: boolean;
}

interface DateRangeColumnTypeModel {
	name: string;
	value: DateRangeColumnType;
	checked: boolean;
}

@Component({
	selector: 'audit-stats-base-form',
	templateUrl: './form.html',
	styleUrls: ['./form.scss'],
	providers: [
		SourceApplicationsService,
		EventTypesService
	]
})

export class AuditStatsBaseFormComponent implements OnInit {
	@ViewChild(MaterialDateRangeComponent, {static: true}) dateRange: MaterialDateRangeComponent;
	@ViewChild(DropdownItemPickerComponent, {static: true}) dropdownItemPickers: DropdownItemPickerComponent;
	@ViewChild(DropdownItemMultiPickerComponent, {static: true}) dropdownItemMultiPickers: DropdownItemMultiPickerComponent;
	@ViewChild('sourceApplications', {static: true}) sourceApplications: DropdownItemMultiPickerComponent;
	@ViewChild('eventTypes', {static: true}) eventTypes: DropdownItemPickerComponent;

	@Output() changed = new EventEmitter<AuditStatsBaseFormModel>();

	@Input() process = '';
	@Input() loading = false;
	@Input() excludeSearchOptions: AuditSearchType[] = [];

	sourceApplicationsSubj = new Subject<DropdownItemMultiPickerModel[]>();
	eventTypesSubj = new Subject<DropdownItemPickerModel[]>();

	params = new AuditStatsBaseFormModel();
	defaultFormParams = new AuditStatsBaseFormModel();
	dates = new DateRangeDataModel();
	defaultDates = DateRangeType.getDateRangeData(DateRangeType.TODAY);

	searchOptions: SearchOptionsModel[] = [
		{name: 'Input file name', value: AuditSearchType.INPUT_OBJECT_KEY, checked: true},
		{name: 'Output file name', value: AuditSearchType.OUTPUT_OBJECT_KEY, checked: true},
		{name: 'Raw file name', value: AuditSearchType.RAW_FILE_NAME, checked: true},
		{name: 'Short error message', value: AuditSearchType.SHORT_ERROR_MESSAGE, checked: true}
	];
	searchModes: SearchOptionsModeModel[] = [
		{name: 'Partial', value: true, checked: true},
		{name: 'Exact', value: false, checked: false}
	];
	dateRangeColumnTypes: DateRangeColumnTypeModel[] = [
		{name: 'Raw File Created Time', value: DateRangeColumnType.RAW_FILE_CREATED_TIME, checked: true},
		{name: 'Start Time', value: DateRangeColumnType.START_TIME, checked: false}
	];
	exclude = [
		DateRangeType.LAST_3HOURS,
		DateRangeType.LAST_12MONTHS
	];

	timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	open = false;
	isEventTypesDropdownHidden = true;

	constructor(
		private route: ActivatedRoute,
		private eventTypesService: EventTypesService,
		private sourceApplicationsService: SourceApplicationsService
	) {}

	ngOnInit() {
		this.configData();
		this.initApplicationsList();
		this.composeSearchOptions();
	}

	submit() {
		const dates = this.composeDates(this.params.dateRange);
		const params = Object.assign(this.params, {...dates});
		this.changed.emit(params);
	}

	applyDates(dates: DateRangeDataModel) {
		this.params.dateRange = dates.dateRange;
		this.params.dateFrom = dates.dateFrom;
		this.params.dateTo = dates.dateTo;
	}

	reset() {
		this.dateRange.reset();
		this.eventTypes.reset();
		this.sourceApplications.reset();
		this.dropdownItemMultiPickers.resetToSelectAll();
		this.params = Object.assign({}, this.defaultFormParams);
		this.submit();
	}

	close() {
		this.open = false;
	}

	configData() {
		const snapshotParams = this.getSnapshotParams();
		const withErrorsOnly = snapshotParams && snapshotParams.withErrorsOnly === 'true';
		const searchTypes = this.getSearchTypes();
		const pipeline = PipelineType[snapshotParams.pipeline];
		const defaultFormParams = this.getDefaultParams();
		const partial = snapshotParams && snapshotParams.partial ? snapshotParams.partial === 'true' : defaultFormParams.partial;
		const dateRangeColumnType = snapshotParams.dateRangeColumnType || DateRangeColumnType.RAW_FILE_CREATED_TIME;
		const page = snapshotParams.page ? +snapshotParams.page : null;
		const sourceApplication = this.getSourceApplicationsFromShapshot();

		this.dates = this.composeDates(snapshotParams.dateRange);
		this.searchModes.forEach((e) => e.checked = e.value ? partial : !partial);
		this.dateRangeColumnTypes.forEach((e) => e.checked = e.value === dateRangeColumnType);

		this.defaultFormParams = defaultFormParams;

		const params = Object.assign({}, defaultFormParams, snapshotParams, {page}, {...this.dates}, {withErrorsOnly}, {searchTypes}, {pipeline}, {partial}, {sourceApplication}, {dateRangeColumnType});
		this.params = new AuditStatsBaseFormModel(params);
	}

	sourceChanged(sourceApps: DropdownItemMultiPickerModel[]) {
		const values = sourceApps.map(e => this.getSourceApplicationValue(e));
		this.composeSourceApplicationsParams(values);
		this.checkEventTypesDropdownVisibility();
		if(values.length > 1) {
			this.eventTypes.removeItems();
			this.eventTypeChanged(null);
		} else {
			this.eventTypeChanged(null);
			this.initEvetTypesList(values);
		}
	}

	eventTypeChanged(eventId: string) {
		this.params.eventId = eventId;
	}

	dateRangeColumnTypeChanged(type: string) {
		this.params.dateRangeColumnType = type;
	}

	searchFileNameChanged(types: SearchOptionsModel[]) {
		this.params.searchTypes = types.map(e => AuditSearchType[e.value]);
	}

	searchModeChanged(status: boolean) {
		this.params.partial = status;
	}

	initApplicationsList() {
		this.configSourceApplicationsStatuses(true, true);

		this.sourceApplicationsService
			.getList(this.process)
			.subscribe(
				resp => {
					this.composeSourceApplicationsData(resp);
					const checkedSourceApplication = this.sourceApplications.values
						.filter(e => e.checked && e.value)
						.map(e => this.getSourceApplicationValue(e));
					this.checkEventTypesDropdownVisibility();
					this.composeSourceApplicationsParams(checkedSourceApplication);
					this.initEvetTypesList(checkedSourceApplication);
					this.configSourceApplicationsStatuses(false, false);
				},
				() => this.configSourceApplicationsStatuses(false, true)
			);
	}

	private composeDates(dateRange: DateRangeType) {
		const snapshotParams = this.getSnapshotParams();
		const dates = DateRangeType.getDateRangeData(dateRange);

		return new DateRangeDataModel({
			dateRange: dates.dateRange || snapshotParams.dateRange,
			dateFrom: dates.dateRange === DateRangeType.ALL ? null : dates.dateFrom || this.params.dateFrom || snapshotParams.dateFrom,
			dateTo: dates.dateRange === DateRangeType.ALL ? null : dates.dateTo || this.params.dateTo || snapshotParams.dateTo
		});
	}

	private composeSourceApplicationsParams(values: SourceApplicationDto[]) {
		this.params.sourceApplication = values.length ? values.map(e => `${e.sourceApplication},${e.pipeline}`) : null;
	}

	private convertSourceApplicationsParams() {
		if(!this.params.sourceApplication) {
			return [];
		}
		return this.params.sourceApplication.map(e => {
			const val = e.split(',');
			return {
				sourceApplication: val[0],
				pipeline: val[1]
			};
		});
	}

	private getSourceApplicationValue(item: DropdownItemMultiPickerModel) {
		return new SourceApplicationDto({
			sourceApplication: item.value ? <string>item.value['sourceApplication'] : null,
			pipeline: item.value? item.value['pipeline'] : null
		});
	}

	private getSourceApplicationsFromShapshot() {
		const params = this.getSnapshotParams();
		return params.sourceApplication && !Array.isArray(params.sourceApplication) ?
			[params.sourceApplication] :
			params.sourceApplication;
	}

	private checkEventTypesDropdownVisibility() {
		const isDataTransfer = this.process === PipelineProcessType.getAlias(PipelineProcessType.DATA_TRANSFER);
		const sourceApplicationParams = this.convertSourceApplicationsParams();
		const isSourceAppsLengthInValid = !sourceApplicationParams.length || sourceApplicationParams.length > 1;
		const isBatchSourceAppNotExist = !sourceApplicationParams.some(e => e.pipeline === PipelineType.BATCH || e.pipeline === PipelineType.HISTORICAL_BATCH);

		this.isEventTypesDropdownHidden = isDataTransfer && (isSourceAppsLengthInValid || isBatchSourceAppNotExist);
	}

	private initEvetTypesList(sourceVal: SourceApplicationDto[]) {
		if(sourceVal.length !== 1 || this.isEventTypesDropdownHidden) {
			this.eventTypes.reset();
			this.eventTypeChanged(null);
			return;
		}

		const queries = new EventTypesQueriesDto({
			sourceApplication: sourceVal[0].sourceApplication,
			pipeline: sourceVal[0].pipeline

		});

		this.configEventTypesStatuses(true, true);

		this.eventTypesService
			.getList(this.process, queries)
			.subscribe(
				resp => {
					this.composeEventTypesData(resp);
					this.configEventTypesStatuses(false, false);
				},
				() => this.configEventTypesStatuses(false, true)
			);
	}

	private getDefaultParams() {
		return new AuditStatsBaseFormModel({
			dateRange: this.defaultDates.dateRange,
			dateFrom: this.defaultDates.dateFrom,
			dateTo: this.defaultDates.dateTo,
			dateRangeColumnType: DateRangeColumnType.RAW_FILE_CREATED_TIME,
			searchTypes: this.getSearchOptionsWithoutExclude().map(e => AuditSearchType[e.value]),
			withErrorsOnly: false,
			partial: true
		});
	}

	private getSnapshotParams() {
		return this.route.snapshot.queryParams;
	}

	private getSearchTypes() {
		const params = this.getSnapshotParams();
		const searchTypesList = params.searchTypes && !Array.isArray(params.searchTypes) ? [params.searchTypes] : params.searchTypes;
		const isSearchTypesQueryExist = searchTypesList && searchTypesList.length;
		let searchTypes = null;

		if(isSearchTypesQueryExist) {
			searchTypes = this.getSearchOptionsWithoutExclude()
				.filter(e => !!~searchTypesList.indexOf(e.value))
				.map(e => e.value);
		} else {
			searchTypes = this.getSearchOptionsWithoutExclude().map(e => e.value);
		}

		return searchTypes;
	}

	private getSearchOptionsWithoutExclude() {
		return this.searchOptions.filter(e => !~this.excludeSearchOptions.indexOf(AuditSearchType[e.value]));
	}

	private composeSearchOptions() {
		const params = this.getSnapshotParams();
		const searchTypesList = params.searchTypes;
		this.searchOptions = this.getSearchOptionsWithoutExclude()
			.map((e) => {
				e.checked = searchTypesList ? !!~searchTypesList.indexOf(e.value) : true;
				return e;
			});
	}

	private composeSourceApplicationsData(resp: SourceApplicationDto[]) {
		const sourceApplicationParams = this.convertSourceApplicationsParams();
		const sourceApplications = resp.map(e => {
			const val = <DropdownItemMultiPickerValueModel>{};
			return new DropdownItemMultiPickerModel({
				name: `${e.sourceApplication}`,
				helpText: `${e.pipeline !== PipelineType.REAL_TIME ? `(${PipelineType.getAlias(e.pipeline)})` : ''}`,
				value: Object.assign(val, e),
				checked: sourceApplicationParams.length && !!sourceApplicationParams.filter(i => {
					return i.sourceApplication === e.sourceApplication && i.pipeline === e.pipeline;
				}).length
			});
		});

		this.sourceApplicationsSubj.next(sourceApplications);
		this.sourceApplicationsSubj.complete();
	}

	private composeEventTypesData(resp: EventTypesDto[]) {
		const eventTypes = resp.map(e => {
			return {
				name: `${e.eventId}`,
				value: e.eventId,
				checked: e.eventId === this.params.eventId
			};
		});

		this.eventTypes.composeData(eventTypes);
	}

	private configSourceApplicationsStatuses(loading: boolean, disabled: boolean) {
		this.sourceApplications.loading = loading;
		this.sourceApplications.disabled = disabled;
	}

	private configEventTypesStatuses(loading: boolean, disabled: boolean) {
		this.eventTypes.loading = loading;
		this.eventTypes.disabled = disabled;
	}
}
