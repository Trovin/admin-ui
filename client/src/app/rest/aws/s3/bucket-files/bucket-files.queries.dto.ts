export class S3BucketFilesQueriesDto {
	page?: number;
	itemsPerPage?: number;
	type?: string;
	search?: string;
	sort?: string;

	constructor(data?: S3BucketFilesQueriesDto) {
		if(!data) {
			return;
		}

		this.page = data.page;
		this.itemsPerPage = data.itemsPerPage;
		this.type = data.type;
		this.search = data.search;
		this.sort = data.sort;
	}
}
