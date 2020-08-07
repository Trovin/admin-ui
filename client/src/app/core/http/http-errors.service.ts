import { Injectable, Injector } from '@angular/core';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import { Params, Data } from '@angular/router';

export class ErrorDataModel implements Data {
	status?: number;
	message?: string;
	detailedMessage?: string;

	constructor(data?: ErrorDataModel) {
		if(data) {
			this.status = data.status;
			this.message = data.message;
			this.detailedMessage = data.detailedMessage;
		}
	}
}

export class ErrorParamsModel implements Params {
	message?: string;
	status?: number | string;
	name?: string;
	time?: number;
	uri?: string;
	url?: string;
	statusText?: string;
	detailedMessage?: string;
	stack?: Error;

	constructor(data?: ErrorParamsModel) {
		if(data) {
			this.message = data.message;
			this.status = data.status;
			this.name = data.name;
			this.time = data.time;
			this.uri = data.uri;
			this.url = data.url;
			this.statusText = data.statusText;
			this.detailedMessage = data.detailedMessage;
			this.stack = data.stack;
		}
	}
}

@Injectable()
export class HttpErrorsService {
	constructor(private injector: Injector) {}

	log(error: HttpErrorResponse, callback: (message: string, details: {}) => void) {
		try {
			const errorData = this.addContextInfo(error);
			callback(errorData.message, errorData);
		} catch(err) {
			console.error(err);
		}
	}

	private addContextInfo(error: HttpErrorResponse) {
		const name = error.name || null;
		const time = new Date().getTime();
		const location = this.injector.get(LocationStrategy);
		const uri = location instanceof PathLocationStrategy ? location.path() : '';
		const url = error.url;
		const status = error.status || null;
		const statusText = error.statusText || error.name;
		const message = `${error.status} ${statusText}`;
		const detailedMessage =  error.error ? error.error.message || error.message : error.message || error.toString();
		const stack = error instanceof HttpErrorResponse ? null : new Error(error);
		const errorWithContext = new ErrorParamsModel({name, time, uri, url, status, statusText, message, detailedMessage, stack});

		return errorWithContext;
	}
}