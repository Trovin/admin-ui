import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http';

import { ReconciliationFileMissingEventGroupDto } from './missing-event.dto';
import { ReconciliationFilesMissingEventsQueriesDto } from './missing-events.queries.dto';


@Injectable()
export class ReconciliationFilesMissingEventsService {
	constructor(private http: HttpRestService) {}

	getList(queries: ReconciliationFilesMissingEventsQueriesDto) {
		return this.http.get<ReconciliationFileMissingEventGroupDto>('/reconciliation-files/missing-events', queries)
			.pipe(
				take(1)
			);
	}
}
