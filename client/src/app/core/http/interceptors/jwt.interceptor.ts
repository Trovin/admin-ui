import { Injectable, OnDestroy } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';

import { switchMap, takeUntil } from 'rxjs/operators';

import { AuthService } from '@core/auth';

import { HttpCancelService } from './../http-cancel.service';
import { Subscription } from 'rxjs';

@Injectable()
export class HttpJwtInterceptor implements HttpInterceptor, OnDestroy {
	private sub = new Subscription();

	constructor(
		private router: Router,
		private authService: AuthService,
		private httpCancelService: HttpCancelService
	) {
		const sub = this.router.events.subscribe(event => {
			if (event instanceof ActivationEnd) {
				this.httpCancelService.cancelPendingRequests();
			}
		});

		this.sub.add(sub);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	intercept(request: HttpRequest<never>, next: HttpHandler) {
		return this.authService.getAccessToken()
			.pipe(
				switchMap(token => this.setToken(token as string, request, next))
			);
	}

	private setToken(token: string, req: HttpRequest<never>, next: HttpHandler) {
		if(!token) {
			return next.handle(req);
		}
		const headers = {
			Authorization: `Bearer ${token}`
		};
		const modified = req.clone({ setHeaders: headers });

		return next.handle(modified)
			.pipe(
				takeUntil(this.httpCancelService.onCancelPendingRequests())
			);
	}
}
