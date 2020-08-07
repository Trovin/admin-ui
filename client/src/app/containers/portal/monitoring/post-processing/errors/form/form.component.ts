import { Component, Input, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';

import { Subscription, Subject } from 'rxjs';

import { MaterialDateRangeComponent } from '@components/ui/date-range/material-date-range/material-date-range.component';
import { DropdownItemPickerComponent } from '@components/ui/dropdown-item-picker/dropdown-item-picker.component';
import { DropdownItemPickerModel } from '@components/ui/dropdown-item-picker/dropdown-item-picker.model';
import { DateRangeDataModel } from '@components/ui/date-range/date-range.model';

import { DateRangeType } from '@enums/date-range-type.enum';

import { RedshiftSchemasService, RedshiftSchemaDto, RedshiftSchemaQueriesDto } from '@rest/redshift/schemas';

import { MonitoringPostProcessingErrorsParamsService } from './../shared/params.service';
import { MonitoringPostProcessingErrorParamsModel } from './../shared/params.model';

@Component({
	selector: 'monitoring-post-processing-errors-form',
	templateUrl: './form.html',
	providers: [
		RedshiftSchemasService
	]
})

export class MonitoringPostProcessingErrorsFormComponent implements OnInit, OnDestroy {
	@ViewChild('dateRange', {static: true}) dateRange: MaterialDateRangeComponent;
	@ViewChild('dropdownTables', {static: true}) dropdownTables: DropdownItemPickerComponent;

	@Output() tableTitlesChanged = new EventEmitter<string[]>();
	@Output() refreshed = new EventEmitter<never>();

	@Input() loading = true;

	private sub = new Subscription();
	private tablesData: RedshiftSchemaDto;
	private DATE_COLUMN_NAME = 'galaxy_update_timestamp';

	tablesSubj = new Subject<DropdownItemPickerModel[]>();

	isTableDateColumnExist = false;
	params = new MonitoringPostProcessingErrorParamsModel();
	dates = new DateRangeDataModel();
	defaultDates = new DateRangeDataModel();

	exclude = [
		DateRangeType.LAST_3HOURS,
		DateRangeType.LAST_12MONTHS
	];

	dataRangeType = DateRangeType;

	constructor(
		private service: RedshiftSchemasService,
		private paramsService: MonitoringPostProcessingErrorsParamsService
	) {
		this.configParams();
	}

	ngOnInit() {
		this.initTables();
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	applyDates(dates: DateRangeDataModel) {
		const params = new MonitoringPostProcessingErrorParamsModel();
		params.dateRange = dates.dateRange;
		params.dateFrom = dates.dateFrom;
		params.dateTo = dates.dateTo;
		params.page = 1;

		this.paramsService.setParams(params);
	}

	changeTable() {
		this.composeTableTitles();
		this.changeParams(true);
	}

	refresh() {
		const params = this.paramsService.getParams();
		this.params.dateRange = params.dateRange;
		this.params.dateFrom = params.dateFrom;
		this.params.dateTo = params.dateTo;
		this.refreshed.emit();
	}

	private initTables() {
		const queries = new RedshiftSchemaQueriesDto();
		queries.schemaType = this.params.schemaType;

		this.configTablesLoadStatuses(true, true);

		const sub = this.service
			.getList(queries)
			.subscribe(
				resp => {
					const data = resp[0];
					this.tablesData = data;
					this.composeDropdownTablesData();
					this.composeTableTitles();
					this.changeParams();
					this.configTablesLoadStatuses(false, false);
				},
				() => this.configTablesLoadStatuses(false, true)
			);

		this.sub.add(sub);
	}

	private changeParams(resetParamsPage?: boolean) {
		const params = this.paramsService.getParams();

		params.schema = this.tablesData.name;
		params.table = this.dropdownTables.values.length ? this.dropdownTables.values.filter(e => e.checked)[0].name : null;

		if(resetParamsPage) {
			params.page = 1;
		}

		if(this.isTableDateColumnExist) {
			params.dateRange = params.dateRange;
			params.dateFrom = params.dateFrom;
			params.dateTo = params.dateTo;
			params.dateTo = params.dateTo;
			params.dateRangeColumn = this.DATE_COLUMN_NAME;
		} else {
			params.dateRange = undefined;
			params.dateFrom = undefined;
			params.dateTo = undefined;
			params.dateRangeColumn = undefined;
			this.dateRange.resetRangeToDefault();
		}
		this.paramsService.setParams(params);
	}

	private composeDropdownTablesData() {
		const tables = this.tablesData.tables.map(e => {
			return new DropdownItemPickerModel({
				name: e.name,
				value: e.name,
				checked: e.name === this.params.table
			});
		});

		if(tables.length && !tables.some(e => e.checked)) {
			tables[0].checked = true;
		}

		this.tablesSubj.next(tables);
		this.tablesSubj.complete();
	}

	private composeTableTitles() {
		const tableTitles = this.dropdownTables.values.filter(e => e.checked).map(e => {
			return this.tablesData.tables
				.filter(i => i.name === e.name)
				.map(i => i.columns)[0];
		});

		this.isTableDateColumnExist = tableTitles.length && tableTitles[0].some(e => e === this.DATE_COLUMN_NAME);
		this.tableTitlesChanged.emit(tableTitles[0]);
	}

	private configParams() {
		const params = this.paramsService.getParams();
		const defaultParams = this.paramsService.getDefaultParams();

		this.dates.dateRange = params.dateRange;
		this.dates.dateFrom = params.dateFrom;
		this.dates.dateTo = params.dateTo;

		this.defaultDates.dateRange = defaultParams.dateRange;
		this.defaultDates.dateFrom = defaultParams.dateFrom;
		this.defaultDates.dateTo = defaultParams.dateTo;

		this.params.schemaType = params.schemaType;
		this.params.schema = params.schema;
		this.params.table = params.table;
		this.params.dateFrom = params.dateFrom;
		this.params.dateTo = params.dateTo;
		this.params.dateRange = params.dateRange;
		this.params.page = params.page;
	}

	private configTablesLoadStatuses(loading: boolean, disabled: boolean) {
		this.dropdownTables.loading = loading;
		this.dropdownTables.disabled = disabled;
	}
}
