import { Injectable } from '@angular/core';
import {
	Router,
	CanActivate,
	CanActivateChild,
	ActivatedRouteSnapshot
} from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PermissionsService } from '../../permissions/permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate, CanActivateChild {
	constructor(
		private permissionsService: PermissionsService,
		private router: Router
	) {}

	canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
		const data = route.data;
		const permissionsToView = data.permissionsToView || [];
		const container = data.container;

		return this.permissionsService.getPermitSubj(container, permissionsToView)
			.pipe(
				map(result => {
					if (!result) {
						this.router.navigateByUrl('/no-permissions', {
							replaceUrl: false
						});
					}

					return result;
				})
			);
	}

	canActivateChild(route: ActivatedRouteSnapshot) {
		return this.canActivate(route);
	}
}
