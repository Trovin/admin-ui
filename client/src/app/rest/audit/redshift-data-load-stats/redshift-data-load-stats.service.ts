import { take } from 'rxjs/operators';

import { AuditStatsBaseDto, AuditStatsBaseQueriesDto, AuditStatsBaseService } from './../shared/stats-base';
import { Injectable } from '@angular/core';

@Injectable()
export class AuditRedhsiftDataLoadStatsService extends AuditStatsBaseService {
	getList(queries: AuditStatsBaseQueriesDto) {
		return super.list<AuditStatsBaseDto, AuditStatsBaseQueriesDto>(queries, 'redshift-data-copy')
			.pipe(
				take(1)
			);
	}
}
