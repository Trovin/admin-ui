import { PipelineProcessOperationType } from '@enums/pipeline-process-operation-type.enum';

export class PipelineErrorDetailsDto {
	processOperation: PipelineProcessOperationType;
	date: Date;
	rawFileName: string;
	objectKey: string;
	bucketName: string;
	details: string;
	startTime: Date;
	eventId?: string;
	processedObjectKey?: string;

	constructor(data?: PipelineErrorDetailsDto) {
		if(!data) {
			return;
		}

		this.processOperation = PipelineProcessOperationType[data.processOperation];
		this.date = data.date;
		this.rawFileName = data.rawFileName;
		this.objectKey = data.objectKey;
		this.bucketName = data.bucketName;
		this.details = data.details;
		this.startTime = data.startTime;
		this.eventId = data.eventId;
		this.processedObjectKey = data.processedObjectKey;
	}
}
