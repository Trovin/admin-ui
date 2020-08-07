import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { HttpRestService } from './../../../core/http/index';

import { PipelinePendingDetailsDto } from './pipeline-pending-details.dto';
import { PipelinePendingDetailsQueriesDto } from './pipeline-pending-details.queries.dto';
import { PageDto } from '@rest/shared/page.dto';
import { map } from 'rxjs/operators';

@Injectable()
export class PipelinePendingDetailsService {
	constructor(private http: HttpRestService) { }

	getList(pipelineAlias: string, queries: PipelinePendingDetailsQueriesDto) {
		const resource = `/monitoring/pipelines/${pipelineAlias}/processes-pending-details`;
		return this.http.get<PageDto<PipelinePendingDetailsDto>>(resource, queries)
			.pipe(
				map(resp => {
					const data = resp;
					const list = resp.content.map(i => new PipelinePendingDetailsDto(i));
					data.content = list;

					return data;
				})
			);
	}
}
