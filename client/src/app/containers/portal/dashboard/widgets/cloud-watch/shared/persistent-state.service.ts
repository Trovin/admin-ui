import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { LocalStorageService } from '@core/localstorage/localstorage.service';

import { DateRangeType } from '@enums/date-range-type.enum';

import { Containers } from '@config/containers.enum';

export interface CloudWatchPersistentStateParams {
	[key: string]: {
		dateRange: DateRangeType;
		dateFrom?: string;
		dateTo?: string;
		period: number;
	};
}

const CONTAINER = `galaxy-${Containers.DASHBOARD}`;

@Injectable()
export class CloudWatchPersistentStateService {
	private dataSubj: BehaviorSubject<CloudWatchPersistentStateParams>;
	private defaultParams: CloudWatchPersistentStateParams;

	constructor(public localStorageService: LocalStorageService) {
		this.defaultParams = this.composeDefaultParams();
		this.dataSubj = new BehaviorSubject<CloudWatchPersistentStateParams>(this.getParams(CONTAINER)); // @TODO: need to add flexibility
	}

	getParamsSubj() {
		return this.dataSubj;
	}

	getParams(key: string): CloudWatchPersistentStateParams {
		const localstorageParams = this.localStorageService.getItem(key) || {};
		Object.keys(localstorageParams).forEach((i) => {
			const dates = DateRangeType.getDateRangeData(localstorageParams[i].dateRange);
			localstorageParams[i].dateRange = dates.dateRange;
			localstorageParams[i].dateFrom = dates.dateFrom;
			localstorageParams[i].dateTo = dates.dateTo;
		});

		return Object.assign({}, this.defaultParams, localstorageParams);
	}

	getDefaultParams() {
		return this.defaultParams;
	}

	setParamsSubj(key: string, params: CloudWatchPersistentStateParams = {}) {
		this.setParams(key, params);
		this.dataSubj.next(this.localStorageService.getItem(key));
	}

	setParams(key: string, params: CloudWatchPersistentStateParams = {}) {
		const currentParams = [this.getParams(key)];
		const objKey = Object.keys(params)[0];

		if(objKey && params[objKey]) {
			currentParams.push({
				[objKey]: params[objKey]
			});
		}

		const data = Object.assign({}, ...currentParams);
		this.localStorageService.setItem(key, data);
	}

	private composeDefaultParams() {
		return {
			default: DateRangeType.getDateRangeData(DateRangeType.LAST_30DAYS)
		} as CloudWatchPersistentStateParams;
	}
}
