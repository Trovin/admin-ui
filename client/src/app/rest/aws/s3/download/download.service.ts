import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';

import { environment } from '@environments/environment';

import { S3DownloadQueriesDto } from './index';

@Injectable()
export class S3DownloadService {
	private host = environment.api;

	constructor(private httpClient: HttpClient) {}

	downloadFile(queries: S3DownloadQueriesDto, resourceApi: string) {
		const resource = this.host + '/aws/s3/' + resourceApi;

		let params = new HttpParams().set('key', queries.key);

		if(queries.zip) {
			params = params.append('zip', queries.zip);
		}

		if(queries.tool) {
			params = params.append('tool', queries.tool);
		}

		if(queries.bucket) {
			params = params.append('bucket', queries.bucket);
		}

		const request = new HttpRequest('GET', resource, {
			reportProgress: true,
			observe: 'response',
			responseType: 'blob',
			params: params
		});

		return this.httpClient.request(request);
	}
}
