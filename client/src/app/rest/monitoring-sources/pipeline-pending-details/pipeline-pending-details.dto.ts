import { PipelineProcessOperationType } from '@enums/pipeline-process-operation-type.enum';
import { PendingDetailsType } from '@enums/pending-details-type.enum';

export class PipelinePendingDetailsDto {
	runId: string;
	eventCount: number;
	sourceApplication: string;
	eventId: string;
	objectKey: string;
	bucketName: string;
	hasError: boolean;
	shortErrorMessage: string;
	pendingDetailsType: PendingDetailsType;
	processOperation: PipelineProcessOperationType;

	constructor(data?: PipelinePendingDetailsDto) {
		if(!data) {
			return;
		}
		this.runId = data.runId;
		this.eventCount = data.eventCount;
		this.sourceApplication = data.sourceApplication;
		this.eventId = data.eventId;
		this.objectKey = data.objectKey;
		this.bucketName = data.bucketName;
		this.hasError = !!data.hasError;
		this.shortErrorMessage = data.shortErrorMessage;
		this.pendingDetailsType = PendingDetailsType[data.pendingDetailsType];
		this.processOperation = PipelineProcessOperationType[data.processOperation];
	}
}