export class S3BucketFilesCleanupDto {
	error?: string;
	success?: string;

	constructor(data?: S3BucketFilesCleanupDto) {
		if(!data) {
			return;
		}

		this.error = data.error;
		this.success = data.success;
	}
}
