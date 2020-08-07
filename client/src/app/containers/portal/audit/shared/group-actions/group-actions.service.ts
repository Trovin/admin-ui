import { Injectable } from '@angular/core';

import { Subject, Observable } from 'rxjs';

import { AuditStatsBaseDto, AuditStatsBaseQueriesDto } from '@rest/audit/shared/stats-base';
import { AuditHideService, AuditHideQueriesDto } from '@rest/audit-hide';
import { AuditReplayService, AuditReplayQueriesDto } from '@rest/audit-replay';
import { AuditHideAllService, AuditHideAllQueriesDto } from '@rest/audit-hide-all';
import { AuditReplayAllService, AuditReplayAllQueriesDto } from '@rest/audit-replay-all';
import { AuditFilesCountService, AuditFilesCountQueriesDto, AuditFileCountDto } from '@rest/audit-files-count';

@Injectable()
export class AuditActionsService {
	private processName: string;

	constructor(
		private filesCountService: AuditFilesCountService,
		private hideService: AuditHideService,
		private replayService: AuditReplayService,
		private hideAllService: AuditHideAllService,
		private replayAllService: AuditReplayAllService
	) {}

	setProcessName(processName: string) {
		this.processName = processName;
	}

	getFileCountObserve(queries: AuditFilesCountQueriesDto): Observable<AuditFileCountDto> {
		const fileCountQueries = new AuditFilesCountQueriesDto(queries);
		return this.filesCountService.get(this.processName, fileCountQueries);
	}

	getCalculatedFileCount(items: AuditStatsBaseDto[]): AuditFileCountDto {
		return new AuditFileCountDto({
			errorsCount: items.filter(i => !!i.errorsCount).length || 0,
			successCount: items.filter(i => !i.errorsCount).length || 0
		});
	}

	hideFilesPerPage(items: AuditStatsBaseDto[]): Subject<string> {
		const subj = new Subject<string>();
		const params = new AuditHideQueriesDto();
		params.runIds = items.map(i => i.runId);

		this.hideService
			.put(this.processName, params)
			.subscribe((r) => {
				subj.next(r['message']);
				subj.complete();
			});

		return subj;
	}

	replayFilesPerPage(items: AuditStatsBaseDto[]): Subject<string> {
		const subj = new Subject<string>();
		const params = items.map(i => new AuditReplayQueriesDto(i));

		this.replayService
			.put(this.processName, params)
			.subscribe((r) => {
				subj.next(r['message']);
				subj.complete();
			});

		return subj;
	}

	hideAll(queries: AuditStatsBaseQueriesDto): Subject<string> {
		const subj = new Subject<string>();
		const hideQueries = new AuditHideAllQueriesDto(queries);

		this.hideAllService
			.put(this.processName, hideQueries)
			.subscribe((r) => {
				subj.next(r['message']);
				subj.complete();
			});

		return subj;
	}

	replayAll(queries: AuditStatsBaseQueriesDto): Subject<string> {
		const subj = new Subject<string>();
		const replayQueries = new AuditReplayAllQueriesDto(queries);

		this.replayAllService
			.put(this.processName, replayQueries)
			.subscribe((r) => {
				subj.next(r['message']);
				subj.complete();
			});

		return subj;
	}
}
