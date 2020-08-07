import { ReconFilter } from '@enums/recon-filter.enum';

export class BatchDataBucketFilesQueriesDto {
	sourceApplication?: string;
	eventIds?: string[];

	dateFrom?: string;
	dateTo?: string;
	page?: number;
	sort?: string;
	objectKey?: string;
	reconFilter?: ReconFilter;

	constructor(data?: BatchDataBucketFilesQueriesDto) {
		if(!data) {
			return;
		}

		this.sourceApplication = data.sourceApplication;
		this.eventIds = data.eventIds;
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
		this.page = data.page;
		this.sort = data.sort;
		this.objectKey = data.objectKey;
		this.reconFilter = ReconFilter[data.reconFilter];
	}
}
