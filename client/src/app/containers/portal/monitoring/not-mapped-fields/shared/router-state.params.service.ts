import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouterStateParamsService } from '@containers/shared/router-state.params.service';

import { SourceCatalogRouterStateParamsModel } from './router-state-params.model';


@Injectable()
export class SourceCatalogRouterStateParamsService extends RouterStateParamsService {

	constructor(public route: ActivatedRoute) {
		super(route);
	}

	getSnapshotQueryParams() {
		if(!!this.route.snapshot.queryParams.reviewed) {
			const reviewed = this.route.snapshot.queryParams.reviewed === 'true';
			return new SourceCatalogRouterStateParamsModel({
				reviewed: reviewed
			});
		}

		return new SourceCatalogRouterStateParamsModel(this.route.snapshot.queryParams);
	}

	composeDefaultParams() {
		const params = new SourceCatalogRouterStateParamsModel({
			reviewed: false
		});
		return params;
	}
}
