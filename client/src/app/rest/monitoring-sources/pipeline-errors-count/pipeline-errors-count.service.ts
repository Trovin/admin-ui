import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { HttpRestService } from './../../../core/http/index';

import { PipelineErrorsCountDto } from './pipeline-errors-count.dto';
import { PipelineErrorsCountQueriesDto } from './pipeline-errors-count.queries.dto';

@Injectable()
export class PipelineErrorsCountService {
	constructor(private http: HttpRestService) { }

	get(pipelineAlias: string, queries: PipelineErrorsCountQueriesDto) {
		const subj = new Subject<PipelineErrorsCountDto[]>();
		const resource = `/monitoring/pipelines/${pipelineAlias}/processes-errors`;

		this.http.get<any>(resource, queries)
			.subscribe(
				(resp: PipelineErrorsCountDto[]) => {
					const list = resp.map(i => {
						let list: PipelineErrorsCountDto = null;
						try {
							list = new PipelineErrorsCountDto(i);
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
