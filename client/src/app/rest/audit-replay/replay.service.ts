import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http/index';

import { DateTimeFormatPipe } from '@components/ui/pipes/date-time-format.pipe';

import { AuditStatsBaseDto } from '@rest/audit/shared/stats-base';

import { AuditReplayQueriesDto } from './replay.queries.dto';

@Injectable()
export class AuditReplayService {
	constructor(
		private http: HttpRestService,
		private dateTimeFormat: DateTimeFormatPipe
		) {}

	put(process: string, body: AuditReplayQueriesDto[]) {
		const url = `/replay/${process}`;
		return this.http
			.update(url, body)
			.pipe(
				take(1)
			);
	}

	public getReplayTooltip(item: AuditStatsBaseDto) {
		const replayStartTime = this.dateTimeFormat.transform(item.replayStartTime);
		const replayEndTime = this.dateTimeFormat.transform(item.replayEndTime);
		let tooltip = `Re-played by ${item.replayBy}.`;
		if(replayStartTime && replayEndTime) {
			tooltip += `\nStarted at ${replayStartTime}, finished at ${replayEndTime}.`;
		} else if(replayStartTime) {
			tooltip += `\nStarted at ${replayStartTime}.`;
		}
		if (item.replayHasError) {
			tooltip += `\nDetails: ${item.replayErrorMessage}.`;
		}
		tooltip += `\nAttempts - ${item.attempts}`;
		return tooltip;
	}

	public getReplayIconStyle(item: AuditStatsBaseDto) {
		let color;
		const replayStatus = this.getReplayStatus(item);
		switch (replayStatus) {
			case ReplayStatus.NONE: {
				color = 'black';
				break;
			}
			case ReplayStatus.ERROR: {
				color = 'red';
				break;
			}
			case ReplayStatus.IN_PROGRESS: {
				color = 'blue';
				break;
			}

			case ReplayStatus.SUCCESS: {
				color = 'green';
				break;
			}
			default: {
				color = 'black';
				break;
			}
		}
		return {'color': color};
	}

	public getReplayStatusMessage(item: AuditStatsBaseDto) {
		let message;
		const replayStatus = this.getReplayStatus(item);
		switch (replayStatus) {
			case ReplayStatus.NONE: {
				message = '';
				break;
			}
			case ReplayStatus.ERROR: {
				message = 'Re-play failed';
				break;
			}
			case ReplayStatus.IN_PROGRESS: {
				message = 'Re-play in progress';
				break;
			}
			case ReplayStatus.SUCCESS: {
				message = 'Re-played';
				break;
			}
			default: {
				message = '';
				break;
			}
		}
		return message;
	}

	private getReplayStatus(item: AuditStatsBaseDto): ReplayStatus {
		if(item.replayHasError) {
			return ReplayStatus.ERROR;
		} else if(!!item.replayStartTime && !item.replayEndTime) {
			return ReplayStatus.IN_PROGRESS;
		} else if(!!item.replayStartTime && !!item.replayEndTime) {
			return ReplayStatus.SUCCESS;
		} else {
			return ReplayStatus.NONE;
		}
	}
}

enum ReplayStatus {
	NONE,
	ERROR,
	IN_PROGRESS,
	SUCCESS
}
