import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject } from 'rxjs';


export class RouterStateParamsModel {
	page?: number;
	itemsPerPage?: number;

	constructor(data: RouterStateParamsModel) {
		if(!data) {
			return;
		}
		this.page = data.page;
		this.itemsPerPage = data.itemsPerPage;
	}
}

@Injectable()
export class RouterStateParamsService {
	private defaultParams: RouterStateParamsModel;
	private dataSubj: BehaviorSubject<RouterStateParamsModel>;

	constructor(public route: ActivatedRoute) {
		this.defaultParams = this.composeDefaultParams();
		this.dataSubj = new BehaviorSubject(this.getParams());
	}

	getParams(): RouterStateParamsModel {
		const routeSnapshotParams = this.getSnapshotQueryParams();
		const page = routeSnapshotParams.page ? +routeSnapshotParams.page : this.defaultParams.page;
		const mappedParams: RouterStateParamsModel = Object.keys(routeSnapshotParams)
			.map((key) => routeSnapshotParams[key] ? {[key]:routeSnapshotParams[key]} : {[key]: this.defaultParams[key]})
			.reduce((prev, cur) => Object.assign(prev, cur), {});

		return Object.assign({}, mappedParams, {page});
	}

	getParamsSubj() {
		return this.dataSubj;
	}

	getDefaultParams() {
		return this.defaultParams;
	}

	setDefaultParams(defaultParams: RouterStateParamsModel) {
		this.defaultParams = defaultParams;
	}

	setParamsSubj(params: RouterStateParamsModel) {
		const currentParams = this.getParams();
		const newParams = Object.assign({}, currentParams, params);
		this.dataSubj.next(newParams);
	}

	protected getSnapshotQueryParams() {
		return this.route.snapshot.queryParams;
	}

	protected composeDefaultParams() {
		return new RouterStateParamsModel({});
	}
}
