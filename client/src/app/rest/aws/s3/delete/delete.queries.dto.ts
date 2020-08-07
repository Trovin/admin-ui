export class S3DeleteFileQueriesDto {
	tool: string;
	key: string;

	constructor(data?: S3DeleteFileQueriesDto) {
		if(!data) {
			return;
		}

		this.tool = data.tool;
		this.key = data.key;
	}
}
