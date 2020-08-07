import { ReconFilter } from '@enums/recon-filter.enum';

export class ReconciliationAllFilesQueriesDto {
	sourceApplication: string;
	eventIds: string[];
	bucket: string;
	dateFrom?: string;
	dateTo?: string;
	key?: string;
	reconFilter?: ReconFilter;

	constructor(data?: ReconciliationAllFilesQueriesDto) {
		if(!data) {
			return;
		}

		this.sourceApplication = data.sourceApplication;
		this.eventIds = data.eventIds;
		this.bucket = data.bucket;
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
		this.key = data.key;
		this.reconFilter = ReconFilter[data.reconFilter];
	}
}
