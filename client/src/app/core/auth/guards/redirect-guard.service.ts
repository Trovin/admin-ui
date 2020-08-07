import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';

import { AuthService } from './../auth.service';

@Injectable()
export class RedirectGuard implements CanActivate {
	constructor(
		private router: Router,
		private authService: AuthService
	) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return Observable.create((observer: Subject<boolean>) => {
			this.authService.isAuthenticated()
				.subscribe((status) => {
					if(status) {
						this.router.navigate(['/portal/dashboard']);
						observer.next(true);
						observer.complete();
						return;
					}

					this.router.navigate(['/public']);
					observer.next(false);
					observer.complete();
				});
		});
	}
}
