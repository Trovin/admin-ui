import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { HttpRestService } from '@core/http';

import { CloudWatchMetricsQueriesDto } from './../cloud-watch-metrics.queries.dto';

import { GetMetricDataOutput } from './metric-data-output.dto';


@Injectable()
export class CloudWatchMetricDataService {
	constructor(private http: HttpRestService) { }

	getList(queries: CloudWatchMetricsQueriesDto) {
		const resource = '/aws/cloud-watch/metric-data';

		return this.http.get<GetMetricDataOutput>(resource, queries)
			.pipe(
				map(dto => new GetMetricDataOutput(dto))
			);
	}
}
