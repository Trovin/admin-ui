import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';

import { RedshiftSchemaType } from '@enums/redshift-schema-type.enum';
import { DateRangeType, DateRange } from '@enums/date-range-type.enum';

import { MonitoringPostProcessingErrorParamsModel } from './params.model';

@Injectable()
export class MonitoringPostProcessingErrorsParamsService {
	private dataSubj = new Subject< MonitoringPostProcessingErrorParamsModel>();

	private defaultParams: MonitoringPostProcessingErrorParamsModel;

	constructor(private route: ActivatedRoute) {
		this.defaultParams = this.composeDefaultParams();
	}

	getParamsSubj() {
		return this.dataSubj;
	}

	getParams(): MonitoringPostProcessingErrorParamsModel {
		const routeSnapshotParams = this.route.snapshot.queryParams;
		const dates = this.getDates();
		const page = routeSnapshotParams.page ? +routeSnapshotParams.page : this.defaultParams.page;

		if(dates && dates.dateRange === DateRangeType.CUSTOM) {
			dates.dateFrom = routeSnapshotParams.dateFrom;
			dates.dateTo = routeSnapshotParams.dateTo;
		}

		const params = Object.assign({}, this.defaultParams, routeSnapshotParams, dates, {page});
		return new MonitoringPostProcessingErrorParamsModel(params);
	}

	getDefaultParams() {
		return this.defaultParams;
	}

	setParams(params: MonitoringPostProcessingErrorParamsModel) {
		const currentParams = this.getParams();
		this.dataSubj.next(Object.assign({}, currentParams, params));
	}

	private composeDefaultParams() {
		const defaultDates = DateRangeType.getDateRangeData(DateRangeType.TODAY);
		return new MonitoringPostProcessingErrorParamsModel({
			schemaType: RedshiftSchemaType.POST_PROCESSING,
			dateRange: defaultDates.dateRange,
			dateFrom: defaultDates.dateFrom,
			dateTo: defaultDates.dateTo,
			page: 1
		});
	}

	getDates(): DateRange {
		const range = this.route.snapshot.queryParams.dateRange;
		return range ? DateRangeType.getDateRangeData(range) : {dateRange: null, dateFrom: null, dateTo: null};
	}
}
