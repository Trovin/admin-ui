export class DidixOperationsHistoryRequestDto {
	page: number;
	itemsPerPage: number;

	constructor(data?: DidixOperationsHistoryRequestDto) {
		if(!data) {
			return;
		}

		this.page = data.page;
		this.itemsPerPage = data.itemsPerPage;
	}
}
