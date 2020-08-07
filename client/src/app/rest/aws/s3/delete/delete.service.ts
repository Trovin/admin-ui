import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http';

import { S3DeleteFileQueriesDto } from './index';

@Injectable()
export class S3DeleteFileService {
	constructor(private http: HttpRestService) { }

	delete(queries: S3DeleteFileQueriesDto) {
		const resource = '/aws/s3/delete';
		return this.http.delete(resource, {params:queries})
			.pipe(
				take(1)
			);
	}
}
