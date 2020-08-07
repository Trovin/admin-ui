import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http';
import { PageDto } from '@rest/shared/page.dto';

import {
	AlarmConfigDto,
	AlarmConfigQueriesDto,
	AlarmConfigDeleteQueriesDto,
	AlarmConfigCreateQueriesDto,
	AlarmConfigUpdateQueriesDto,
	AlarmConfigActiveQueriesDto
} from './index';

@Injectable()
export class AlarmConfigService {
	constructor(private http: HttpRestService) { }

	getList(queries: AlarmConfigQueriesDto) {
		const resource = '/s3-source-alarm/configs';
		return this.list<AlarmConfigDto, AlarmConfigQueriesDto>(queries, resource)
			.pipe(
				take(1)
			);
	}

	delete(queries: AlarmConfigDeleteQueriesDto) {
		const resource = '/s3-source-alarm/configs/delete';
		return this.http.delete(resource, {params:queries})
			.pipe(
				take(1)
			);
	}

	create(queries: AlarmConfigCreateQueriesDto) {
		const resource = '/s3-source-alarm/configs/generate-config';
		return this.http.create(resource, queries)
			.pipe(
				take(1)
			);
	}

	update(queries: AlarmConfigUpdateQueriesDto) {
		const resource = '/s3-source-alarm/configs/update';
		return this.http.create(resource, queries)
			.pipe(
				take(1)
			);
	}

	switchState(queries: AlarmConfigActiveQueriesDto) {
		const resource = '/s3-source-alarm/configs/state';
		return this.http.create(resource, queries)
			.pipe(
				take(1)
			);
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
