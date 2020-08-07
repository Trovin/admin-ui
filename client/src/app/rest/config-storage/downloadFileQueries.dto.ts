export class S3DownloadFileQueriesDto {
	key: string;
	tool: string;
	zip?: string;
	bucket?: string;

	constructor(data?: S3DownloadFileQueriesDto) {
		if(!data) {
			return;
		}

		this.key = data.key;
		this.tool = data.tool;
		this.zip = data.zip;
		this.bucket = data.bucket;
	}
}