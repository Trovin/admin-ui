export class NotMappedFieldsQueriesDto {
	reviewed?: boolean;
	page?: number;

	constructor(data?: NotMappedFieldsQueriesDto) {
		if(!data) {
			return;
		}

		this.page = data.page;
		this.reviewed = data.reviewed;
	}
}
