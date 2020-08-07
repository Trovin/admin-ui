export class AuditReplayQueriesDto {
	runId: string;
	bucketName: string;
	objectKey: string;

	constructor(data?: AuditReplayQueriesDto) {
		if(!data) {
			return;
		}
		this.runId = data.runId;
		this.bucketName = data.bucketName;
		this.objectKey = data.objectKey;
	}
}
