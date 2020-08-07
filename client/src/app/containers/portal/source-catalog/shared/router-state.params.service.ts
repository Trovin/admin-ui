import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SortColumnType } from '@enums/sort-column-type.enum';

import { RouterStateParamsService } from '@containers/shared/router-state.params.service';

import { SourceCatalogRouterStateParamsModel } from './router-state-params.model';


@Injectable()
export class SourceCatalogRouterStateParamsService extends RouterStateParamsService {

	constructor(public route: ActivatedRoute) {
		super(route);
	}

	getSnapshotQueryParams() {
		return new SourceCatalogRouterStateParamsModel(this.route.snapshot.queryParams);
	}

	composeDefaultParams() {
		const params = new SourceCatalogRouterStateParamsModel({sort: [`${SortColumnType.SOURCE_APP},ASC`, `${SortColumnType.APPLIED_DATE},DESC`]});
		return params;
	}
}
