import { AuditStatsBaseDto } from '@rest/audit/shared/stats-base';
import { IErrorsPageQueryParams } from '../shared/base-stats.component';

export class AuditDTLModel extends AuditStatsBaseDto {
	hideInProcess?: boolean;
	replayInProcess?: boolean;
	replayStatus?: string;
	errorDetailsLink: string;
	errorDetailsParams: IErrorsPageQueryParams;

	constructor(data?: AuditDTLModel) {
		super(data);

		if(data) {
			this.replayInProcess = data.replayInProcess;
			this.replayStatus = data.replayStatus;
			this.errorDetailsLink = data.errorDetailsLink;
			this.errorDetailsParams = data.errorDetailsParams;
		}
	}
}
