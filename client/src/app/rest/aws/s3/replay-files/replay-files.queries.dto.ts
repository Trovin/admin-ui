export class S3ReplayFilesQueriesDto {
	page?: number;

	constructor(data?: S3ReplayFilesQueriesDto) {
		if(!data) {
			return;
		}

		this.page = data.page;
	}
}
