import { FileProcessStatus } from '@enums/file-process-status.enum';

interface ReconciliationDataDto {
	reconciliationMissingCount: number;
	reconciliationError: boolean;
	reconDate: Date;
	redshiftTargetTable: string;
	redshiftTargetSchema: string;
	errorDetail: string;
}

export class BatchDataBucketFileDto {
	objectKey: string;
	bucketName: string;
	lastModified?: Date;
	size?: number;
	sourceApplication?: string;
	reconciliations: ReconciliationDataDto[];
	eventId?: string;
	eventCount?: number;
	fileProcessStatus: FileProcessStatus;

	constructor(data?: BatchDataBucketFileDto) {
		if(!data) {
			return;
		}

		this.objectKey = data.objectKey;
		this.bucketName = data.bucketName;
		this.reconciliations = data.reconciliations;
		this.lastModified = data.lastModified;
		this.size = data.size;
		this.sourceApplication = data.sourceApplication;
		this.eventId = data.eventId;
		this.eventCount = data.eventCount;
		this.fileProcessStatus = FileProcessStatus[data.fileProcessStatus];
	}
}
