import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { HttpRestService } from '@core/http/index';

import { PipelineProcessDto } from './pipeline-process.dto';
import { PipelineProcessQueriesDto } from './pipeline-process.queries.dto';

@Injectable()
export class PipelineProcessService {
	constructor(private http: HttpRestService) { }

	get(pipeline: string, processName: string, queries: PipelineProcessQueriesDto) {
		const subj = new Subject<PipelineProcessDto>();
		const resource = `/monitoring/pipelines/${pipeline}/processes/${processName}`;

		this.http.get<PipelineProcessDto>(resource, queries)
			.subscribe(
				resp => {
					let data = null;
					try {
						data = new PipelineProcessDto(resp);
					} catch(e) {
						console.error(e);
					}
					subj.next(data);
					subj.complete();
				},
				error => subj.error(error)
			);

		return subj;
	}
}
