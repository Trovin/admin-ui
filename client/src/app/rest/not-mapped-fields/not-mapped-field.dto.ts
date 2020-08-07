export class NotMappedFieldDto {
	id: number;
	sourceApplication: string;
	eventId: string;
	objectKey: string;
	bucket: string;
	comment: string;
	reviewer: string;
	reviewed: boolean;
	jsonPath: string;
	createdTimestamp: Date;
	updatedTimestamp: Date;
	redshiftTableName: string;
	redshiftSchemaName: string;

	reviewLoading?: boolean;

	constructor(data: NotMappedFieldDto) {
		if(!data) {
			return;
		}

		this.id = data.id;
		this.sourceApplication = data.sourceApplication;
		this.eventId = data.eventId;
		this.objectKey = data.objectKey;
		this.comment = data.comment;
		this.reviewer = data.reviewer;
		this.reviewed = data.reviewed;
		this.jsonPath = data.jsonPath;
		this.createdTimestamp = data.createdTimestamp;
		this.updatedTimestamp = data.updatedTimestamp;
		this.reviewLoading = data.reviewLoading;
		this.bucket = data.bucket;
		this.redshiftTableName = data.redshiftTableName;
		this.redshiftSchemaName = data.redshiftSchemaName;
	}
}
