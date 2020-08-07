import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { LocalStorageService } from '@core/localstorage/localstorage.service';

import { DateRangeDataModel } from '@components/ui/date-range/date-range.model';

import { DateRangeType } from '@enums/date-range-type.enum';

import { CloudWatchPersistentStateService, CloudWatchPersistentStateParams } from './../persistent-state.service';

type Dates = {
	dateRange: DateRangeType;
	dateFrom: string;
	dateTo: string;
};

@Component({
	selector: 'cloud-watch-widget-form',
	templateUrl: './form.html',
	styleUrls: ['./form.scss'],
	providers: [
		LocalStorageService
	]
})
export class CloudWatchWidgetFormComponent implements OnInit {
	@Output() changed = new EventEmitter<DateRangeDataModel>();

	@Input() loading = false;
	@Input() title = '';
	@Input() id = '';
	@Input() linkToAWSCloudWatchMetric = '';

	dates: Dates = {
		dateRange: DateRangeType.LAST_30DAYS,
		dateFrom: null,
		dateTo: null
	};

	exclude = [
		DateRangeType.ALL,
		DateRangeType.TODAY,
		DateRangeType.LAST_HOUR,
		DateRangeType.CUSTOM
	];

	data: DateRangeDataModel;

	constructor(private cloudWatchPersistentStateService: CloudWatchPersistentStateService) {
		this.data = DateRangeType.getDateRangeData(this.dates.dateRange);
	}

	ngOnInit() {
		this.cloudWatchPersistentStateService
			.getParamsSubj()
			.subscribe((params: CloudWatchPersistentStateParams) => {
				this.configParams(params);
			});
	}

	private configParams(params: CloudWatchPersistentStateParams) {
		const dates = DateRangeType.getDateRangeData(DateRangeType.LAST_30DAYS);

		this.dates.dateRange = params[this.id] ? params[this.id].dateRange : dates.dateRange;
		this.dates.dateFrom = params[this.id] ? params[this.id].dateFrom : dates.dateFrom;
		this.dates.dateTo = params[this.id] ? params[this.id].dateTo : dates.dateTo;
		this.data = DateRangeType.getDateRangeData(this.dates.dateRange);
	}

	submit(event?: DateRangeDataModel) {
		if(event) {
			this.data = DateRangeType.getDateRangeData(DateRangeType[event.dateRange]);
		}

		this.changed.emit(this.data);
	}
}
