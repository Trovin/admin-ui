export class NotMappedFieldsReviewStateQueriesDto {
	state: boolean;
	reviewer: string;

	constructor(data?: NotMappedFieldsReviewStateQueriesDto) {
		if(!data) {
			return;
		}

		this.state = data.state;
		this.reviewer = data.reviewer;
	}
}
