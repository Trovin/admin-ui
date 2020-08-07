import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http';

import { S3BucketFilesExecuteQueriesDto } from './bucket-files-execute.queries.dto';

@Injectable()
export class S3BucketFilesExecuteService {
	constructor(private http: HttpRestService) {}

	post(body: S3BucketFilesExecuteQueriesDto) {
		const resource = '/aws/s3/bucket-files-execute';

		return this.http.create(resource, body)
			.pipe(
				take(1)
			);
	}
}
