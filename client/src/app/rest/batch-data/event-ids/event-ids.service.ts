import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http';

import { BatchDataEventIdDto } from './event-id.dto';
import { BatchDataEventIdsQueriesDto } from './event-ids.queries.dto';

@Injectable()
export class BatchDataEventIdsService {
	constructor(private http: HttpRestService) { }

	getList(bucket: string, queries: BatchDataEventIdsQueriesDto) {
		const resource = `/input-files/${bucket}/event-ids`;

		return this.http.get<BatchDataEventIdDto>(resource, queries)
			.pipe(
				take(1)
			);
	}
}
