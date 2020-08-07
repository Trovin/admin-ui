
import { take } from 'rxjs/operators';

import { AuditStatsBaseDto, AuditStatsBaseQueriesDto, AuditStatsBaseService } from './../shared/stats-base';
import { Injectable } from '@angular/core';

@Injectable()
export class AuditBatchService extends AuditStatsBaseService {
	getList(queries: AuditStatsBaseQueriesDto) {
		return super.list<AuditStatsBaseDto, AuditStatsBaseQueriesDto>(queries, 'batch')
			.pipe(
				take(1)
			);
	}
}
