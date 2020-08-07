export class S3ReplayFileDto {
	objectKey: string;
	userEmail: string;
	lastModified: Date;

	constructor(data?: S3ReplayFileDto) {
		if(!data) {
			return;
		}

		this.objectKey = data.objectKey;
		this.userEmail = data.userEmail;
		this.lastModified = data.lastModified;
	}
}
