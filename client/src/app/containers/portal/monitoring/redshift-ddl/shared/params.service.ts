import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { DateRangeType, DateRange } from '@enums/date-range-type.enum';
import { DateRangeColumnType } from '@enums/date-range-column-type.enum';

import { MonitoringRedshiftDdlParamsModel } from './params.model';

@Injectable()
export class MonitoringRedshiftDdlParamsService {
	private dataSubj: BehaviorSubject<MonitoringRedshiftDdlParamsModel>;

	private defaultParams: MonitoringRedshiftDdlParamsModel;

	constructor(private route: ActivatedRoute) {
		this.defaultParams = this.composeDefaultParams();
		this.dataSubj = new BehaviorSubject(this.getParams());
	}

	getParamsSubj() {
		return this.dataSubj;
	}

	getParams(): MonitoringRedshiftDdlParamsModel {
		const routeSnapshotParams = this.route.snapshot.queryParams;
		const range = this.route.snapshot.queryParams.dateRange || this.defaultParams.dateRange;
		const dates = DateRangeType.getDateRangeData(range);

		if(dates && dates.dateRange === DateRangeType.CUSTOM) {
			dates.dateFrom = routeSnapshotParams.dateFrom;
			dates.dateTo = routeSnapshotParams.dateTo;
		}

		const params = Object.assign({}, this.defaultParams, routeSnapshotParams, dates);

		return new MonitoringRedshiftDdlParamsModel(params);
	}

	getQueries() {
		const params = this.getParams();
		const isDateRangeNotAll = params.dateRange !== DateRangeType.ALL;
		const dateRange = isDateRangeNotAll ? params.dateRange : null;
		const dateRangeColumnType = isDateRangeNotAll ? params.dateRangeColumnType : null;
		return Object.assign({}, params, {dateRangeColumnType}, {dateRange});
	}

	setParamsSubj(params: MonitoringRedshiftDdlParamsModel) {
		const currentParams = this.getParams();
		this.dataSubj.next(Object.assign({}, currentParams, params));
	}

	getDefaultParams() {
		return this.defaultParams;
	}

	private composeDefaultParams() {
		const defaultDates = DateRangeType.getDateRangeData(DateRangeType.TODAY);
		return new MonitoringRedshiftDdlParamsModel({
			page: 1,
			dateRangeColumnType: DateRangeColumnType.START_TIME,
			dateRange: defaultDates.dateRange,
			dateFrom: defaultDates.dateFrom,
			dateTo: defaultDates.dateTo
		});
	}
}
