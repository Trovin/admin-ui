export class S3BucketFileDto {
	objectKey?: string;
	lastModified?: Date;

	constructor(data?: S3BucketFileDto) {
		if(!data) {
			return;
		}

		this.objectKey = data.objectKey;
		this.lastModified = data.lastModified;
	}
}
