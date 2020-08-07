import { Injectable } from '@angular/core';

import { take, switchMap, map } from 'rxjs/operators';

import { HttpRestService } from '@core/http';

import { S3CheckExistFilesQueriesDto, S3CheckExistFileDto } from './index';

@Injectable()
export class S3CheckExistFilesService {
	constructor(private http: HttpRestService) { }

	check(queries: S3CheckExistFilesQueriesDto) {
		const resource = '/aws/s3/check-files-exist';
		return this.http.get<S3CheckExistFileDto[]>(resource, queries)
			.pipe(
				take(1)
			);
	}
}
