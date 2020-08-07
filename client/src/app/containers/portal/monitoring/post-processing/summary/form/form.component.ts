import { Component, Input, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';

import { Subscription } from 'rxjs';

import { MaterialDateRangeComponent } from '@components/ui/date-range/material-date-range/material-date-range.component';
import { DateRangeDataModel } from '@components/ui/date-range/date-range.model';

import { DateRangeType } from '@enums/date-range-type.enum';

import { MonitoringPostProcessingSummaryParamsService } from './../shared/params.service';

import { MonitoringPostProcessingSummaryParamsModel } from './../shared/params.model';

@Component({
	selector: 'monitoring-post-processing-summary-form',
	templateUrl: './form.html'
})

export class MonitoringPostProcessingSummaryFormComponent {
	@ViewChild('dateRange', {static: true}) dateRange: MaterialDateRangeComponent;

	@Output() tableTitlesChanged = new EventEmitter<string[]>();
	@Output() refreshed = new EventEmitter<never>();

	@Input() loading = true;

	private sub = new Subscription();

	params = new MonitoringPostProcessingSummaryParamsModel();
	dates = new DateRangeDataModel();
	defaultDates = new DateRangeDataModel();

	exclude = [
		DateRangeType.LAST_3HOURS,
		DateRangeType.LAST_12MONTHS
	];

	dataRangeType = DateRangeType;

	constructor(private paramsService: MonitoringPostProcessingSummaryParamsService) {
		this.configDefaultDates();

		const sub = this.paramsService
			.getParamsSubj()
			.subscribe((params) => {
				this.composeParams(params);
				this.composeDates(params);
			});
		this.sub.add(sub);
	}

	applyDates(dates: DateRangeDataModel) {
		this.params.dateRange = dates.dateRange;
		this.params.dateFrom = dates.dateFrom;
		this.params.dateTo = dates.dateTo;

		this.paramsService.setParams(this.params);
	}

	refresh() {
		const params = this.paramsService.getParams();
		this.params.dateRange = params.dateRange;
		this.params.dateFrom = params.dateFrom;
		this.params.dateTo = params.dateTo;
		this.refreshed.emit();
	}

	private composeDates(params: MonitoringPostProcessingSummaryParamsModel) {
		this.dates.dateRange = params.dateRange;
		this.dates.dateFrom = params.dateFrom;
		this.dates.dateTo = params.dateTo;
	}

	private configDefaultDates() {
		const defaultParams = this.paramsService.getDefaultParams();
		this.defaultDates.dateRange = defaultParams.dateRange;
		this.defaultDates.dateFrom = defaultParams.dateFrom;
		this.defaultDates.dateTo = defaultParams.dateTo;
	}

	private composeParams(params: MonitoringPostProcessingSummaryParamsModel) {
		this.params.schemaType = params.schemaType;
		this.params.dateFrom = params.dateFrom;
		this.params.dateTo = params.dateTo;
		this.params.dateRange = params.dateRange;
	}
}
