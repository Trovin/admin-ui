import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DateRangeType } from '@enums/date-range-type.enum';

import { RouterStateParamsService } from '@containers/shared/router-state.params.service';

import { RedshiftEmptyRecordsRouterStateParamsModel } from './router-state-params.model';


@Injectable()
export class RedshiftEmptyRecordsRouterStateParamsService extends RouterStateParamsService {

	constructor(public route: ActivatedRoute) {
		super(route);
	}

	getSnapshotQueryParams() {
		const routeSnapshotParams = Object.assign({}, this.composeDefaultParams(), this.route.snapshot.queryParams);
		const dates = DateRangeType.getDateRangeData(routeSnapshotParams.dateRange);

		if(dates.dateRange === DateRangeType.CUSTOM) {
			dates.dateFrom = routeSnapshotParams.dateFrom;
			dates.dateTo = routeSnapshotParams.dateTo;
		}

		const params = Object.assign({}, routeSnapshotParams, dates);
		return new RedshiftEmptyRecordsRouterStateParamsModel(params);
	}

	composeDefaultParams() {
		const params = new RedshiftEmptyRecordsRouterStateParamsModel({
			page: 1,
			showIgnore: false,
			dateRange: DateRangeType.TODAY
		});
		return params;
	}
}
