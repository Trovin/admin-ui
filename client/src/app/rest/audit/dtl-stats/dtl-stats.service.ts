
import { take } from 'rxjs/operators';

import { AuditStatsBaseDto, AuditStatsBaseQueriesDto, AuditStatsBaseService } from './../shared/stats-base';
import { Injectable } from '@angular/core';

@Injectable()
export class AuditDTLStatsService extends AuditStatsBaseService {
	getList(queries: AuditStatsBaseQueriesDto) {
		return super.list<AuditStatsBaseDto, AuditStatsBaseQueriesDto>(queries, 'data-transfer')
			.pipe(
				take(1)
			);
	}
}
