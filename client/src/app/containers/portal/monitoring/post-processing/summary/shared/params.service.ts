import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { RedshiftSchemaType } from '@enums/redshift-schema-type.enum';
import { DateRangeType, DateRange } from '@enums/date-range-type.enum';

import { MonitoringPostProcessingSummaryParamsModel } from './params.model';

@Injectable()
export class MonitoringPostProcessingSummaryParamsService {
	private dataSubj: BehaviorSubject<MonitoringPostProcessingSummaryParamsModel>;

	private defaultParams: MonitoringPostProcessingSummaryParamsModel;

	constructor(private route: ActivatedRoute) {
		this.defaultParams = this.composeDefaultParams();
		this.dataSubj = new BehaviorSubject(this.getParams());
	}

	getParamsSubj() {
		return this.dataSubj;
	}

	getParams(): MonitoringPostProcessingSummaryParamsModel {
		const routeSnapshotParams = this.route.snapshot.queryParams;
		const dates = this.getDates();

		if(dates && dates.dateRange === DateRangeType.CUSTOM) {
			dates.dateFrom = routeSnapshotParams.dateFrom;
			dates.dateTo = routeSnapshotParams.dateTo;
		}

		const params = Object.assign({}, this.defaultParams, routeSnapshotParams, dates);
		return new MonitoringPostProcessingSummaryParamsModel(params);
	}

	getDefaultParams() {
		return this.defaultParams;
	}

	setParams(params: MonitoringPostProcessingSummaryParamsModel) {
		const currentParams = this.getParams();
		this.dataSubj.next(Object.assign({}, currentParams, params));
	}

	private composeDefaultParams() {
		const defaultDates = DateRangeType.getDateRangeData(DateRangeType.TODAY);
		return new MonitoringPostProcessingSummaryParamsModel({
			schemaType: RedshiftSchemaType.POST_PROCESSING,
			dateRange: defaultDates.dateRange,
			dateFrom: defaultDates.dateFrom,
			dateTo: defaultDates.dateTo
		});
	}

	getDates(): DateRange {
		const range = this.route.snapshot.queryParams.dateRange || this.defaultParams.dateRange;
		return range ? DateRangeType.getDateRangeData(range) : {dateRange: null, dateFrom: null, dateTo: null};
	}
}
