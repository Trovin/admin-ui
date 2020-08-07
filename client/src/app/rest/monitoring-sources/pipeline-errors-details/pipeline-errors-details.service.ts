import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { HttpRestService } from './../../../core/http/index';

import { PipelineErrorDetailsDto } from './pipeline-error-details.dto';
import { PipelineErrorDetailsQueriesDto } from './pipeline-error-details.queries.dto';

@Injectable()
export class PipelineErrorsDetailsService {
	constructor(private http: HttpRestService) { }

	getList(pipeline: string, process: string, queries?: PipelineErrorDetailsQueriesDto) {
		const subj = new Subject<PipelineErrorDetailsDto[]>();
		const resource = `/monitoring/pipelines/${pipeline}/processes/${process}/errors-details`;

		this.http.create(resource, queries)
			.subscribe(
				(resp: PipelineErrorDetailsDto[]) => {
					const data = resp.map((i: PipelineErrorDetailsDto) => {
						let d: PipelineErrorDetailsDto = null;
						try {
							d = new PipelineErrorDetailsDto(i);
						} catch (e) {
							console.error(e);
						}
						return d;
					});
					subj.next(data);
					subj.complete();
				},
				error => subj.error(error)
			);

		return subj;
	}
}
