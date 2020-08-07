import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, Subject } from 'rxjs';

import { AuthService } from './../auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
	constructor(private authService: AuthService) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return Observable.create((observer: Subject<boolean>) => {
			this.authService.isAuthenticated()
				.subscribe((status) => {
					if(status) {
						observer.next(true);
						observer.complete();
						return;
					}

					this.authService.setAuthenticationSubj(false);
					this.authService.login(state.url.split('?')[0], route.queryParams);

					observer.next(false);
					observer.complete();
				});
		});
	}

	canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return this.canActivate(route, state);
	}
}
