import { AuditStatsBaseDto } from '@rest/audit/shared/stats-base';

import { IErrorsPageQueryParams } from './../shared/base-stats.component';

export class AuditBatchModel extends AuditStatsBaseDto {
	hideInProcess?: boolean;
	replayInProcess?: boolean;
	replayStatus?: string;
	errorDetailsLink: string;
	errorDetailsParams: IErrorsPageQueryParams;

	constructor(data?: AuditBatchModel) {
		super(data);

		if(data) {
			this.hideInProcess = data.hideInProcess;
			this.replayInProcess = data.replayInProcess;
			this.replayStatus = data.replayStatus;
			this.errorDetailsLink = data.errorDetailsLink;
			this.errorDetailsParams = data.errorDetailsParams;
		}
	}
}
