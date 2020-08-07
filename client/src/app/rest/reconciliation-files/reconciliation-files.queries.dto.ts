import { GalaxyBucket } from '@enums/galaxy-bucket.enum';

export class ReconciliationFilesQueriesDto {
	objectKeys: string[];
	inputFileType: GalaxyBucket;

	constructor(data?: ReconciliationFilesQueriesDto) {
		if(!data) {
			return;
		}

		this.objectKeys = data.objectKeys;
		this.inputFileType = data.inputFileType;
	}
}
