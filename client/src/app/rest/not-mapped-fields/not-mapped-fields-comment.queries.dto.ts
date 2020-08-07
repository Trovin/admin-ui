export class NotMappedFieldsCommentQueriesDto {
	comment: string;

	constructor(data?: NotMappedFieldsCommentQueriesDto) {
		if(!data) {
			return;
		}

		this.comment = data.comment;
	}
}
