import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { BatchDataMissingEventsParamsModel } from './params.model';

@Injectable()
export class BatchDataMissingEventsParamsService {
	private defaultParams: BatchDataMissingEventsParamsModel;
	private dataSubj: BehaviorSubject<BatchDataMissingEventsParamsModel>;

	constructor(private route: ActivatedRoute) {
		const params = Object.assign({}, this.defaultParams, {page: 1});
		this.defaultParams = new BatchDataMissingEventsParamsModel(params);
		this.dataSubj = new BehaviorSubject(this.getParams());
	}

	getParams(): BatchDataMissingEventsParamsModel {
		const routeSnapshotParams = new BatchDataMissingEventsParamsModel(this.route.snapshot.queryParams);
		const page = routeSnapshotParams.page ? +routeSnapshotParams.page : this.defaultParams.page;

		const params = Object.assign({}, this.defaultParams, routeSnapshotParams, {page});
		return params;
	}

	getParamsSubj() {
		return this.dataSubj;
	}

	setDefaultParamsSubj() {
		this.dataSubj.next(this.defaultParams);
	}

	setParamsSubj(params: BatchDataMissingEventsParamsModel) {
		const currentParams = this.getParams();
		this.dataSubj.next(Object.assign({}, currentParams, params));
	}
}
