import { Injectable, Injector } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { alertsService } from '@components/ui';

import { HttpErrorsService } from './../http-errors.service';

@Injectable()
export class HttpErrorsInterceptor implements HttpInterceptor {
	constructor(private injector: Injector) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
		return next
			.handle(request)
			.pipe(
				catchError((error: HttpErrorResponse) => {
					console.log('Investigate Error 504', error);
					error.status === 401 ? this.showUnauthorizedError() : this.showDetailedError(error);
					return throwError(error);
				})
			);
	}

	private showDetailedError(error: HttpErrorResponse) {
		const httpErrorsService = this.injector.get(HttpErrorsService);

		httpErrorsService.log(error, alertsService.detailedError.bind(alertsService));
	}

	private showUnauthorizedError() {
		const message = 'Your session has expired. Press "Login" button below to login again and restore the session. After that please re-try your operation.';
		alertsService.unauthorizedError(message, null);
	}
}
