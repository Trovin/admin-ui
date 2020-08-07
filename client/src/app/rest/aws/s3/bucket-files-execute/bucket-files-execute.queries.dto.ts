export class S3BucketFilesExecuteQueriesDto {
	key: string;
	rsTemplateKey: string;
	enableWarnLevelValidation?: boolean;

	constructor(data?: S3BucketFilesExecuteQueriesDto) {
		if(!data) {
			return;
		}

		this.key = data.key;
		this.rsTemplateKey = data.rsTemplateKey;
		this.enableWarnLevelValidation = data.enableWarnLevelValidation;
	}
}
