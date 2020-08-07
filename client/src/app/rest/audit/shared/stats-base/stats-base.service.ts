import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { PageDto } from '@rest/shared/page.dto';
import { HttpRestService } from '@core/http';

@Injectable()
export class AuditStatsBaseService {
	constructor(private http: HttpRestService) { }

	list<T, Q>(queries: Q, resource: string) {
		const subj = new Subject<PageDto<T>>();

		this.http.create<PageDto<T>>('/audit/' + resource, queries)
			.subscribe(
				resp => {
					const data = resp;
					data.content = resp.content.map(i => {
						let list: T = null;
						try {
							list = i;
						} catch (e) {
							console.error(e);
						}
						return list;
					});

					subj.next(data);
					subj.complete();
				},
				error => subj.error(error)
			);

		return subj;
	}

	listBase<T, Q>(queries: Q, resource: string) {
		const subj = new Subject<T[]>();

		this.http.get<T[]>('/audit/' + resource, queries)
			.subscribe(
				resp => {
					const list = resp.map(i => {
						let list: T = null;
						try {
							list = i;
						} catch(e) {
							console.error(e);
						}
						return list;
					});

					subj.next(list);
					subj.complete();
				},
				error => subj.error(error)
			);

		return subj;
	}
}
