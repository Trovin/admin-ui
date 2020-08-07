import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouterStateParamsService } from '@containers/shared/router-state.params.service';
import { BaseParamsModel } from './params-base.model';

@Injectable()
export class ParamsService extends RouterStateParamsService {
	constructor(route: ActivatedRoute) {
		super(route);
	}

	getSnapshotQueryParams() {
		const routeSnapshotParams = Object.assign({}, this.composeDefaultParams(), this.route.snapshot.queryParams);
		return new BaseParamsModel(routeSnapshotParams);
	}

	protected composeDefaultParams() {
		return new BaseParamsModel();
	}
}
