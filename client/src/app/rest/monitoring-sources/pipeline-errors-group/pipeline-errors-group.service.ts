import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { HttpRestService } from './../../../core/http/index';

import { PipelineErrorsGroupDto } from './pipeline-errors-group.dto';
import { PipelineErrorsGroupQueriesDto } from './pipeline-errors-group.queries.dto';

@Injectable()
export class PipelineErrorsGroupService {
	constructor(private http: HttpRestService) { }

	getList(pipeline: string, process: string, queries?: PipelineErrorsGroupQueriesDto) {
		const subj = new Subject<PipelineErrorsGroupDto[]>();
		const resource = `/monitoring/pipelines/${pipeline}/processes/${process}/errors-group`;

		this.http.create(resource, queries)
			.subscribe(
				(resp: PipelineErrorsGroupDto[]) => {
					const list = resp.map(i => new PipelineErrorsGroupDto(i));
					subj.next(list);
					subj.complete();
				},
				error => subj.error(error)
			);

		return subj;
	}
}
