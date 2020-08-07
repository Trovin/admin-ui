import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';

import { PageDto } from '@rest/shared/page.dto';
import { HttpRestService } from '@core/http';

import { S3ReplayFileDto } from './replay-file.dto';
import { S3ReplayFilesQueriesDto } from './replay-files.queries.dto';

@Injectable()
export class S3ReplayFilesService {
	constructor(private http: HttpRestService) { }

	getList(queries: S3ReplayFilesQueriesDto) {
		const resource = '/aws/s3/replay-files';

		return this.http.get<PageDto<S3ReplayFileDto>>(resource, queries)
			.pipe(
				take(1)
			);
	}
}
