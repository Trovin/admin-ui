import { Component, Input, ViewChild, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { MaterialDateRangeComponent } from '@components/ui/date-range/material-date-range/material-date-range.component';
import { DateRangeDataModel } from '@components/ui/date-range/date-range.model';

import { DateRangeType } from '@enums/date-range-type.enum';

import { StatisticsParamsService } from './../shared/params.service';
import { MonitoringStatsBaseParamsModel } from './../shared/base-params.model';
import { DateRangeColumnType } from '@enums/date-range-column-type.enum';

interface DateRangeColumnTypeModel {
	name: string;
	value: DateRangeColumnType;
	checked: boolean;
}

@Component({
	selector: 'monitoring-stats-form',
	templateUrl: './form.html'
})

export class MonitoringStatsFormComponent implements OnDestroy {
	@ViewChild(MaterialDateRangeComponent, {static: true}) dateRange: MaterialDateRangeComponent;

	@Input() loading = false;

	private sub = new Subscription();

	params = new MonitoringStatsBaseParamsModel();
	dates = new DateRangeDataModel();
	defaultDates = new DateRangeDataModel();

	timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	dateRangeColumnTypes: DateRangeColumnTypeModel[] = [
		{name: 'Raw File Created Time', value: DateRangeColumnType.RAW_FILE_CREATED_TIME, checked: true},
		{name: 'Start Time', value: DateRangeColumnType.START_TIME, checked: false}
	];
	exclude = [
		DateRangeType.LAST_3HOURS,
		DateRangeType.LAST_12MONTHS
	];

	dataRangeType = DateRangeType;

	constructor(private paramsService: StatisticsParamsService) {
		this.configData();

		const sub = this.paramsService
			.getParamsSubj()
			.subscribe((params) => {
				this.composeParams(params);
			});
		this.sub.add(sub);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	applyDates(dates: DateRangeDataModel) {
		const dateRange = dates.dateRange;
		const dateFrom = dates.dateFrom;
		const dateTo = dates.dateTo;
		const page = 1;

		this.paramsService.setParams({...this.params, dateRange, dateFrom, dateTo, page});
	}

	refresh() {
		const params = this.paramsService.getParams();
		this.paramsService.setParams(params);
	}

	reset() {
		const params = this.paramsService.getDefaultParams();
		this.paramsService.setParams(params);
		this.dateRange.reset();
	}

	dateRangeColumnTypeChanged(type: DateRangeColumnType) {
		this.paramsService.setParams({...this.params, dateRangeColumnType: type});
	}

	private configData() {
		const params = this.paramsService.getParams();
		const defaultParams = this.paramsService.defaultParams;

		this.dates.dateRange = params.dateRange;
		this.dates.dateFrom = params.dateFrom;
		this.dates.dateTo = params.dateTo;

		this.defaultDates.dateRange = defaultParams.dateRange;
		this.defaultDates.dateFrom = defaultParams.dateFrom;
		this.defaultDates.dateTo = defaultParams.dateTo;

		this.dateRangeColumnTypes.forEach(e => e.checked = e.value === params.dateRangeColumnType);
	}

	private composeParams(params: MonitoringStatsBaseParamsModel) {
		this.params = {...this.params, ...params};
	}
}
