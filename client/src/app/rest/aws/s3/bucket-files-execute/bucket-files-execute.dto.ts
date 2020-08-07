export class S3BucketFilesExecuteDto {
	status: number|string;
	message: string;
	objectKey: string;

	constructor(data?: S3BucketFilesExecuteDto) {
		if(!data) {
			return;
		}

		this.status = data.status;
		this.message = data.message;
		this.objectKey = data.objectKey;
	}
}
