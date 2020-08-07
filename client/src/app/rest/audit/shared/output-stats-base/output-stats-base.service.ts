import { map } from 'rxjs/operators';

import { PageDto } from '@rest/shared/page.dto';

import { AuditOutputStatsBaseDto } from './output-stats-base.dto';
import { AuditOutputProcessBaseQueriesDto } from './output-stats-base.queries.dto';

import { AuditStatsBaseService } from './../stats-base/stats-base.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuditOutputStatsBaseService extends AuditStatsBaseService {
	getList(queries: AuditOutputProcessBaseQueriesDto, processName: string) {
		const resource = processName + '/';
		return super.list<AuditOutputStatsBaseDto, AuditOutputProcessBaseQueriesDto>(queries, resource)
			.pipe(
				map((dto: PageDto<AuditOutputStatsBaseDto>) => {
					dto.content = dto.content.map(i => new AuditOutputStatsBaseDto(i));
					return dto;
				})
			);
	}

	getBaseList(queries: AuditOutputProcessBaseQueriesDto, processName: string) {
		const resource = processName + '/';
		return super.listBase<AuditOutputStatsBaseDto, AuditOutputProcessBaseQueriesDto>(queries, resource)
			.pipe(
				map((dto: AuditOutputStatsBaseDto[]) => dto.map(i => new AuditOutputStatsBaseDto(i)))
			);
	}
}
