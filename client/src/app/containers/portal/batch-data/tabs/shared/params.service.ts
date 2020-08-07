import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouterStateParamsService } from '@containers/shared/router-state.params.service';

import { ReconFilter } from '@enums/recon-filter.enum';
import { BatchDataBaseParamsModel } from './params-base.model';
import { DateRangeType } from '@enums/date-range-type.enum';


@Injectable()
export class BatchDataParamsService extends RouterStateParamsService {
	constructor(route: ActivatedRoute) {
		super(route);
	}

	getSnapshotQueryParams() {
		const routeSnapshotParams = Object.assign({}, this.composeDefaultParams(), this.route.snapshot.queryParams);
		return new BatchDataBaseParamsModel(routeSnapshotParams);
	}

	protected composeDefaultParams() {
		return new BatchDataBaseParamsModel({
			page: 1,
			reconFilter: ReconFilter.ALL,
			dateRange: DateRangeType.ALL
		});
	}
}
