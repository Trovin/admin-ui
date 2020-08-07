export class S3CheckExistFilesQueriesDto {
	bucket: string;
	keys: string[];

	constructor(data?: S3CheckExistFilesQueriesDto) {
		if(!data) {
			return;
		}

		this.bucket = data.bucket;
		this.keys = data.keys;
	}
}
