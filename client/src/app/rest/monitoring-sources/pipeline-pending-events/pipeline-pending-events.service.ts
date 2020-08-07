import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { HttpRestService } from './../../../core/http/index';

import { PipelinePendingEventsQueriesDto } from './pipeline-pending-events.queries.dto';
import { PipelinePendingEventsDto } from './pipeline-pending-events.dto';

@Injectable()
export class PipelinePendingEventsService {
	constructor(private http: HttpRestService) { }

	get(pipelineAlias: string, queries: PipelinePendingEventsQueriesDto) {
		const subj = new Subject<PipelinePendingEventsDto[]>();
		const resource = `/monitoring/pipelines/${pipelineAlias}/processes-pending`;

		this.http.get<any>(resource, queries)
			.subscribe(
				(resp: PipelinePendingEventsDto[]) => {
					const list = resp.map(i => new PipelinePendingEventsDto(i));
					subj.next(list);
					subj.complete();
				},
				err => subj.error(err)
			);

		return subj;
	}
}
