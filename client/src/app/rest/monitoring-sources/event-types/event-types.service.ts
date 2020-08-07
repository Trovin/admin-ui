import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http';

import { MonitoringEventTypeDto } from './event-type.dto';
import { MonitoringEventTypesQueriesDto } from './event-types.queries.dto';

@Injectable()
export class MonitoringEventTypesService {
	constructor(private http: HttpRestService) { }

	getList(queries: MonitoringEventTypesQueriesDto, pipeline: string, sourceApplication: string) {
		return this.http.get<MonitoringEventTypeDto[]>(`/monitoring/pipelines/${pipeline}/source-applications/${sourceApplication}/event-types`, queries)
			.pipe(
				take(1)
			);
	}
}
