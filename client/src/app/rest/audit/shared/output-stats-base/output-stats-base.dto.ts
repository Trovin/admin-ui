export class AuditOutputStatsBaseDto {
	active: number;
	id: string;
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
	createdTimestamp: Date;
	timediff: string;
	isBatch: boolean;
	isHistorical: boolean;
	shortErrorMessage: string;

	constructor(data?: AuditOutputStatsBaseDto) {
		if(!data) {
			return;
		}

		this.active = data.active;
		this.id = data.id;
		this.runId = data.runId;
		this.sourceApplication = data.sourceApplication;
		this.eventId = data.eventId;
		this.rawFileName = data.rawFileName;
		this.rawFileCreatedTime = data.rawFileCreatedTime;
		this.startTime = data.startTime;
		this.endTime = data.endTime;
		this.objectKey = data.objectKey;
		this.bucketName = data.bucketName;
		this.eventCount = data.eventCount;
		this.hasError = data.hasError;
		this.statusCode = data.statusCode;
		this.errorDetail = data.errorDetail;
		this.createdTimestamp = data.createdTimestamp;
		this.timediff = data.timediff;
		this.isBatch = data.isBatch;
		this.isHistorical = data.isHistorical;
		this.shortErrorMessage = data.shortErrorMessage;
	}
}
