export class AlarmConfigQueriesDto {
	page?: number;
	itemsPerPage?: number;
	bucket?: string;
	sourcePrefix?: string;
	status?: string;
	sort?: string;
	enabledOnly?: boolean;

	constructor(data?: AlarmConfigQueriesDto) {
		if(!data) {
			return;
		}

		this.page = data.page;
		this.itemsPerPage = data.itemsPerPage;
		this.bucket = data.bucket;
		this.sourcePrefix = data.sourcePrefix;
		this.sort = data.sort;
		this.status = data.status;
		this.enabledOnly = data.enabledOnly;
	}
}
