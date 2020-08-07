import { Injectable } from '@angular/core';
import { Router, RouterEvent, ActivatedRouteSnapshot, NavigationEnd, Params } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class RouterParamsService {
	params: BehaviorSubject<Params>;
	paramsSnapshot: Params;

	constructor(private router: Router) {
		this.paramsSnapshot = {};
		this.params = new BehaviorSubject(this.paramsSnapshot);

		this.router.events
			.pipe(
				filter((event: RouterEvent) => event instanceof NavigationEnd)
			)
			.subscribe(() => {
				const snapshot = this.router.routerState.snapshot.root;
				const nextParams = this.collectParams(snapshot);

				if(this.compareParams(this.paramsSnapshot, nextParams)) {
					this.params.next(this.paramsSnapshot = nextParams);
				}
			});
	}

	private collectParams(root: ActivatedRouteSnapshot): Params {
		const params: Params = {};

		(function mergeParamsFromSnapshot(snapshot: ActivatedRouteSnapshot) {
			Object.assign(params, snapshot.params);
			snapshot.children.forEach(mergeParamsFromSnapshot);
		})(root);

		return params;
	}

	private compareParams(currentParams: Params, nextParams: Params): boolean {
		const currentKeys = Object.keys(currentParams);
		const nextKeys = Object.keys(nextParams);

		if(currentKeys.length !== nextKeys.length) {
			return true;
		}

		for(let i = 0, length = currentKeys.length; i < length; i++) {
			const key = currentKeys[i];
			if(currentParams[key] !== nextParams[key]) {
				return true;
			}
		}

		return false;
	}
}