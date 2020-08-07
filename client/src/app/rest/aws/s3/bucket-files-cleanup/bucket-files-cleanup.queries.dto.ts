export class S3BucketFilesCleanupQueriesDto {
	key: string;
	rsTemplateKey: string;

	constructor(data?: S3BucketFilesCleanupQueriesDto) {
		if(!data) {
			return;
		}
		this.key = data.key;
		this.rsTemplateKey = data.rsTemplateKey;
	}
}
