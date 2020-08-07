export class SourceCatalogQueriesDto {
	page?: number;
	sort: string[];
	sourceApplication?: string;
	itemsPerPage?: number;

	constructor(data?: SourceCatalogQueriesDto) {
		if(!data) {
			return;
		}

		this.page = data.page;
		this.sort = data.sort;
		this.sourceApplication = data.sourceApplication;
		this.itemsPerPage = data.itemsPerPage;
	}
}
