import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { DateRangeType, DateRange } from '@enums/date-range-type.enum';
import { DateRangeColumnType } from '@enums/date-range-column-type.enum';

import { MonitoringStatsBaseParamsModel } from './base-params.model';

@Injectable()
export class StatisticsParamsService {
	private dataSubj: BehaviorSubject<MonitoringStatsBaseParamsModel>;

	defaultParams: MonitoringStatsBaseParamsModel;

	constructor(private route: ActivatedRoute) {
		const defaultDates = DateRangeType.getDateRangeData(DateRangeType.TODAY);
		const params = Object.assign({}, defaultDates, {page: 1, dateRangeColumnType: DateRangeColumnType.RAW_FILE_CREATED_TIME});
		this.defaultParams = new MonitoringStatsBaseParamsModel(params);
		this.dataSubj = new BehaviorSubject(this.getParams());
	}

	getParamsSubj() {
		return this.dataSubj;
	}

	getParams(): MonitoringStatsBaseParamsModel {
		const routeSnapshotParams = this.route.snapshot.queryParams;
		const dates = this.getDates();
		const page = routeSnapshotParams.page ? +routeSnapshotParams.page : this.defaultParams.page;
		const dateRangeColumnType = routeSnapshotParams.dateRangeColumnType || this.defaultParams.dateRangeColumnType;

		if(dates.dateRange === DateRangeType.CUSTOM) {
			dates.dateFrom = routeSnapshotParams.dateFrom;
			dates.dateTo = routeSnapshotParams.dateTo;
		}

		const params = Object.assign({}, this.defaultParams, routeSnapshotParams, dates, {page, dateRangeColumnType});
		return new MonitoringStatsBaseParamsModel(params);
	}

	setParams(params: MonitoringStatsBaseParamsModel) {
		const currentParams = this.getParams();
		this.dataSubj.next(Object.assign({}, currentParams, params));
	}

	getDefaultParams() {
		return this.defaultParams;
	}

	private getDates(): DateRange {
		const range = this.route.snapshot.queryParams.dateRange || this.defaultParams.dateRange;
		return DateRangeType.getDateRangeData(range);
	}
}
