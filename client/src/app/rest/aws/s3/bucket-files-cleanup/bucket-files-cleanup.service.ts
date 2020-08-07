import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http';

import { S3BucketFilesCleanupQueriesDto } from './bucket-files-cleanup.queries.dto';

@Injectable()
export class S3BucketFilesCleanupService {
	constructor(private http: HttpRestService) {}

	post(body: S3BucketFilesCleanupQueriesDto) {
		const resource = '/aws/s3/bucket-files-cleanup';

		return this.http.create(resource, body)
			.pipe(
				take(1)
			);
	}
}
