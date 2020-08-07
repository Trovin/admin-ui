import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http';

import { PageDto } from '@rest/shared/page.dto';

import { BatchDataBucketFileDto } from './bucket-file.dto';
import { BatchDataBucketFilesQueriesDto } from './bucket-files.queries.dto';
import { BatchDataBucketFileDownloadDto } from './bucket-file-download.dto';

@Injectable()
export class BatchDataBucketFilesService {
	constructor(private http: HttpRestService) { }

	getList(bucket: string, queries: BatchDataBucketFilesQueriesDto) {
		const resource = `/input-files/${bucket}/bucket-files`;

		return this.list<BatchDataBucketFileDto, BatchDataBucketFilesQueriesDto>(queries, resource)
			.pipe(
				take(1)
			);
	}

	download(bucket: string, queries: BatchDataBucketFilesQueriesDto) {
		const subj = new Subject<BatchDataBucketFileDownloadDto>();

		const resource = `/input-files/${bucket}/bucket-files/download`;

		this.http.get<BatchDataBucketFileDownloadDto>(resource, queries, {
			reportProgress: true,
			observe: 'response',
			responseType: 'blob'
		})
		.subscribe(
			resp => {
				subj.next(resp);
				subj.complete();
			},
			error => subj.error(error)
		);

		return subj;
	}

	private list<T, Q>(queries: Q, resource: string) {
		const subj = new Subject<PageDto<T>>();

		this.http.get<PageDto<T>>(resource, queries)
			.subscribe(
				data => {
					subj.next(data);
					subj.complete();
				},
				error => subj.error(error)
			);

		return subj;
	}
}
