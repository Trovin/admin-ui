export class S3DownloadQueriesDto {
	key: string;
	tool?: string;
	zip?: string;
	bucket?: string;

	constructor(data?: S3DownloadQueriesDto) {
		if(!data) {
			return;
		}

		this.key = data.key;
		this.tool = data.tool;
		this.zip = data.zip;
		this.bucket = data.bucket;
	}
}
