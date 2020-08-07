export class ReconciliationFilesMissingEventsQueriesDto {
	objectKey: string;
	bucketName: string;
	redshiftTargetSchema: string;
	redshiftTargetTable: string;

	constructor(data?: ReconciliationFilesMissingEventsQueriesDto) {
		if(!data) {
			return;
		}

		this.objectKey = data.objectKey;
		this.bucketName = data.bucketName;
		this.redshiftTargetSchema = data.redshiftTargetSchema;
		this.redshiftTargetTable = data.redshiftTargetTable;
	}
}
