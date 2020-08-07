export class BatchDataMissingEventsParamsModel {
	page?: number;
	objectKey?: string;
	bucketName?: string;
	redshiftTargetSchema?: string;
	redshiftTargetTable?: string;

	constructor(data?: BatchDataMissingEventsParamsModel) {
		if(!data) {
			return;
		}

		this.page = data.page;
		this.objectKey = data.objectKey;
		this.bucketName = data.bucketName;
		this.redshiftTargetSchema = data.redshiftTargetSchema;
		this.redshiftTargetTable = data.redshiftTargetTable;
	}
}
