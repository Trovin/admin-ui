import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, combineLatest } from 'rxjs';

import { RouterParamsService } from '@core/router/params.service';

@Injectable()
export class ParamsService {
	dataSubj: Observable<any>; // @TODO: add types

	constructor(
		private route: ActivatedRoute,
		private routerParams: RouterParamsService
	) {
		this.dataSubj = combineLatest(
			this.route.queryParams,
			this.routerParams.params,
			(qparams, params) => {
				return Object.assign({}, params, qparams);
			}
		);
	}

	getDataSubj() {
		return this.dataSubj;
	}

	getParamsSnapshot() {
		return this.routerParams.params;
	}
}
