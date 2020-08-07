import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { HttpRestService } from './../../../core/http/index';

import { PipelineCustomContentDto } from './custom-content.dto';
import { PipelineCustomContentQueriesDto } from './custom-content.queries.dto';
import { take } from 'rxjs/internal/operators/take';

@Injectable()
export class PipelineCustomContentService {
	constructor(private http: HttpRestService) { }

	get(pipeline: string, process: string, queries?: PipelineCustomContentQueriesDto) {
		const subj = new Subject<PipelineCustomContentDto>();
		const resource = `/monitoring/pipelines/${pipeline}/processes/${process}/custom-content`;

		this.http.get<PipelineCustomContentDto>(resource, queries)
			.subscribe(
				(resp: PipelineCustomContentDto) => {
					const data = new PipelineCustomContentDto(resp);
					subj.next(data);
					subj.complete();
				},
				error => subj.error(error)
			);

		return subj;
	}

	post(pipeline: string, process: string, body: any) {
		const resource = `/monitoring/pipelines/${pipeline}/processes/${process}/custom-content`;

		return this.http.create(resource, body)
			.pipe(
				take(1)
			);
	}
}
