import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';

import { environment } from '@environments/environment';

import { S3UploaderQueriesDto, S3UploaderResponseDto } from './index';

@Injectable()
export class S3UploaderService {
	private host = environment.api;

	constructor(private httpClient: HttpClient) {}

	upload(queries?: S3UploaderQueriesDto) {
		const resource = this.host + '/aws/s3/' + queries.url;
		let params = new HttpParams().set('key', queries.key);

		if(queries.bucketConfigKey) {
			params = params.append('bucketConfigKey', queries.bucketConfigKey);
		}

		if(queries.bucket) {
			params = params.append('bucket', queries.bucket);
		}

		if(queries.enableValidate) {
			params = params.append('enableValidate', 'true');
		}

		const request = new HttpRequest('POST', resource, queries.formData, {
			reportProgress: true,
			params: params
		});

		return this.httpClient.request<S3UploaderResponseDto>(request);
	}

	delete(queries?: S3UploaderQueriesDto) {
		const resource = this.host + queries.url;
		return this.httpClient.delete(resource);
	}
}
