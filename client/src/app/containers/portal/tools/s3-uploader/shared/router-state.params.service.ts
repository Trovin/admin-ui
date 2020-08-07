import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RouterStateParamsService } from '@containers/shared/router-state.params.service';

import { S3UploaderRouterStateParamsModel } from './router-state-params.model';


@Injectable()
export class S3UploaderRouterStateParamsService extends RouterStateParamsService {

	constructor(public route: ActivatedRoute) {
		super(route);
	}

	getSnapshotQueryParams() {
		return new S3UploaderRouterStateParamsModel(this.route.snapshot.queryParams);
	}

	composeDefaultParams() {
		return new S3UploaderRouterStateParamsModel();
	}
}
