import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http';

import { EventTypesDto } from './event-types.dto';
import { EventTypesQueriesDto } from './event-types.queries.dto';

@Injectable()
export class EventTypesService {
	constructor(private http: HttpRestService) { }

	getList(process: string, queries: EventTypesQueriesDto) {
		return this.http.get<EventTypesDto[]>(`/processes/${process}/event-types`, queries)
			.pipe(
				take(1)
			);
	}
}
