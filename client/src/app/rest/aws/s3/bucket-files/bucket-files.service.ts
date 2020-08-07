import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';

import { PageDto } from '@rest/shared/page.dto';
import { HttpRestService } from '@core/http';

import { S3BucketFileDto } from './bucket-file.dto';
import { S3BucketFilesQueriesDto } from './bucket-files.queries.dto';

@Injectable()
export class S3BucketFilesService {
	constructor(private http: HttpRestService) { }

	getList(queries: S3BucketFilesQueriesDto, resourceApi: string) {
		const resource = '/aws/s3/' + resourceApi;
		return this.http.get<PageDto<S3BucketFileDto>>(resource, queries)
			.pipe(
				take(1)
			);
	}
}
