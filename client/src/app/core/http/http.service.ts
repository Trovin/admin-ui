import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '@environments/environment';

import { CustomEncoder } from './custom-encoder';

export interface IHttpQueries {
	[key: string]: any;
}

@Injectable()
export class HttpRestService {
	private apiUrl = environment.api;

	constructor(private http: HttpClient) {}

	get<T>(uri: string, queries?: IHttpQueries, options?: {
		headers?: HttpHeaders | {
			[header: string]: string | string[];
		};
		observe?: string;
		reportProgress?: boolean;
		responseType?: string;
		withCredentials?: boolean;
	}): Observable<T> {
		const params = HttpRestService.toHttpParams(queries);
		const url = this.apiUrl + uri;

		return this.http.get<T>(url, Object.assign(params, options || {}));
	}

	create<T>(uri: string, body: any, queries?: IHttpQueries): Observable<T> {
		const url = this.apiUrl + uri;
		const params = HttpRestService.toHttpParams(queries);
		return this.http.post<T>(url, body, params);
	}

	update<T>(uri: string, body: any, queries?: IHttpQueries): Observable<T> {
		const url = this.apiUrl + uri;
		const params = HttpRestService.toHttpParams(queries);
		return this.http.put<T>(url, body, params);
	}

	delete<T>(uri: string, queries?: IHttpQueries): Observable<T> {
		const url = this.apiUrl + uri;
		return this.http.delete<T>(url, queries);
	}

	private static toHttpParams(obj: IHttpQueries, params = new HttpParams({encoder: new CustomEncoder()})): {[param: string]: HttpParams} {
		if(!obj) {
			return {};
		}

		Object.keys(obj)
			.filter((key: string) => {
				const val = obj[key];
				return val !== '' && val !== undefined && val !== null;
			}).forEach((key: string) => {
				if(obj.hasOwnProperty(key)) {
					const val = obj[key];
					if(Array.isArray(val)) {
						val.forEach(id => {
							params = params.append(`${key}[]`, id);
						});
					} else if(val === 'object') {
						this.toHttpParams(val, params);
					} else {
						params = params.append(key, val);
					}
				}
			});
		return {'params': params};
	}
}
