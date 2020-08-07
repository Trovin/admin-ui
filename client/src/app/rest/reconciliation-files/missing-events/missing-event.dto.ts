export type ReconciliationFileMissingEventsIdsDto = {
	[key: string]: any;
};

export type MissingEventsIdsFileDto = {
	objectKey: string;
	bucketName: string;
};

export class ReconciliationFileMissingEventGroupDto {
	missingCount: number;
	missingIds: ReconciliationFileMissingEventsIdsDto[];
	missingEventsIdsFiles: MissingEventsIdsFileDto[];

	constructor(data?: ReconciliationFileMissingEventGroupDto) {
		if(!data) {
			return;
		}

		this.missingCount = data.missingCount;
		this.missingIds = data.missingIds;
		this.missingEventsIdsFiles = data.missingEventsIdsFiles;
	}
}
