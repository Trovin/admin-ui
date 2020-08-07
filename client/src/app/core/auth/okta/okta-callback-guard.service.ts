import { Injectable } from '@angular/core';
import { Router, CanActivate, NavigationExtras } from '@angular/router';

import { Observable, Subject } from 'rxjs';

import { AuthService } from './../auth.service';

@Injectable()
export class OktaCallbackGuardService implements CanActivate {
	constructor(
		private authService: AuthService,
		private router: Router
	) {}

	canActivate(): Observable<boolean> {
		return Observable.create((observer:  Subject<boolean>) => {
			this.authService.isAuthenticated()
				.subscribe((status) => {
					if(status) {
						observer.next(status);
						observer.complete();
						return;
					}
					this.authService.handleAuthentication()
						.subscribe(
							(status) => {
								observer.next(status);
								observer.complete();
							},
							(e) => {
								this.navigate(e.message);
								observer.next(false);
								observer.complete();
							}
						);
				});
		});
	}

	protected navigate(errMessage?: string) {
		const navigationExtras: NavigationExtras = {
			queryParams: {
				'errorMessage': errMessage
			},
			queryParamsHandling: 'merge'
		};
		this.router.navigate(['/errors/authentication-error'], navigationExtras);
	}
}
