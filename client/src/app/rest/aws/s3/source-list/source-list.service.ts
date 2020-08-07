import { Injectable } from '@angular/core';
import { HttpRestService } from '@core/http';

import { take } from 'rxjs/operators';

import { S3SourceDto } from './source.dto';
import { S3SourceListQueriesDto } from './source-list.queries.dto';

@Injectable()
export class S3SourceListService {
	constructor(private http: HttpRestService) { }

	getList(queries: S3SourceListQueriesDto) {
		const resource = '/aws/s3/source-list';
		return this.http.get<S3SourceDto[]>(resource, queries)
			.pipe(
				take(1)
			);
	}
}
