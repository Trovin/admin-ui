export class ReplayBasedFileQueriesDto {
	objectKey: string;

	constructor(data?: ReplayBasedFileQueriesDto) {
		if(!data) {
			return;
		}

		this.objectKey = data.objectKey;
	}
}
