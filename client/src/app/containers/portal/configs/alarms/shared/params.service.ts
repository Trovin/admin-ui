import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { AlarmDataParamsModel } from './../alarm-config-data-params.model';

@Injectable()
export class AlarmDataParamsService {
	private defaultParams: AlarmDataParamsModel;
	private dataSubj: BehaviorSubject<AlarmDataParamsModel>;

	constructor(private route: ActivatedRoute) {
		const params = Object.assign({}, this.defaultParams, {page: 1});
		this.defaultParams = new AlarmDataParamsModel(params);
		this.dataSubj = new BehaviorSubject(this.getParams());
	}

	getParams(): AlarmDataParamsModel {
		const routeSnapshotParams = new AlarmDataParamsModel(this.route.snapshot.queryParams);
		const page = routeSnapshotParams.page ? +routeSnapshotParams.page : this.defaultParams.page;
		const enabledOnly = routeSnapshotParams.enabledOnly || false;
		const params = Object.assign({}, this.defaultParams, routeSnapshotParams, {page}, {enabledOnly});
		return params;
	}

	getParamsSubj() {
		return this.dataSubj;
	}

	setDefaultParamsSubj() {
		this.dataSubj.next(this.defaultParams);
	}

	setParamsSubj(params: AlarmDataParamsModel) {
		const paramsData = this.getParams();
		this.dataSubj.next(Object.assign(paramsData, params));
	}
}
