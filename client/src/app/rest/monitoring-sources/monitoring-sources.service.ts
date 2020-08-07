import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { HttpRestService } from '@core/http';

import { PageDto } from '@rest/shared/page.dto';

import { MonitoringSourcesModel } from './monitoring-sources.model';
import { MonitoringSourcesQueriesDto } from './monitoring-sources.queries.dto';

@Injectable()
export class MonitoringSourcesService {
	constructor(private http: HttpRestService) {}

	getList(pipeline: string, queries: MonitoringSourcesQueriesDto) {
		return this.http.get<PageDto<MonitoringSourcesModel>>(`/monitoring/pipelines/${pipeline}/source-applications`, queries)
			.pipe(
				map(resp => {
					const data = resp;
					const list = resp.content.map(i => new MonitoringSourcesModel(i));
					data.content = list;

					return data;
				})
			);
	}
}
