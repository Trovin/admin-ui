
import { take } from 'rxjs/operators';

import { AuditStatsBaseDto, AuditStatsBaseQueriesDto, AuditStatsBaseService } from './../shared/stats-base';
import { Injectable } from '@angular/core';

@Injectable()
export class AuditEmrFilterStatusService extends AuditStatsBaseService {
	getList(queries: AuditStatsBaseQueriesDto) {
		return super.list<AuditStatsBaseDto, AuditStatsBaseQueriesDto>(queries, 'emr-filter-status')
			.pipe(
				take(1)
			);
	}
}
