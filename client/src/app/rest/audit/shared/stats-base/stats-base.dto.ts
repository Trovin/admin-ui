export class AuditStatsBaseDto {
	runId: string;
	sourceApplication: string;
	eventId: string;
	rawFileName: string;
	rawFileCreatedTime: Date;
	startTime: Date;
	endTime: Date;
	objectKey: string;
	bucketName: string;
	eventCount: number;
	hasError: number;
	statusCode: string;
	errorDetail: string;
	errorsCount: number;
	createdTimestamp: Date;
	timediff: string;
	isBatch: number;
	isHistorical: number;
	pipeline: string;
	replayStartTime: Date;
	replayEndTime: Date;
	replayBy: string;
	replayHasError: boolean;
	attempts: number;
	processedObjectKey: string;
	replayErrorMessage: string;

	constructor(data?: AuditStatsBaseDto) {
		if(!data) {
			return;
		}

		this.replayHasError = data.replayHasError;
		this.replayStartTime = data.replayStartTime;
		this.replayEndTime = data.replayEndTime;
		this.replayBy = data.replayBy;
		this.runId = data.runId;
		this.eventId = data.eventId;
		this.sourceApplication = data.sourceApplication;
		this.rawFileName = data.rawFileName;
		this.rawFileCreatedTime = data.rawFileCreatedTime;
		this.startTime = data.startTime;
		this.endTime = data.endTime;
		this.objectKey = data.objectKey;
		this.bucketName = data.bucketName;
		this.eventCount = data.eventCount;
		this.hasError = +data.hasError;
		this.statusCode = data.statusCode;
		this.errorDetail = data.errorDetail;
		this.createdTimestamp = data.createdTimestamp;
		this.errorsCount = data.errorsCount;
		this.isBatch = data.isBatch;
		this.isHistorical = data.isHistorical;
		this.pipeline = data.pipeline;
		this.timediff = data.timediff;
		this.attempts = data.attempts;
		this.processedObjectKey = data.processedObjectKey;
		this.replayErrorMessage = data.replayErrorMessage;
	}
}
