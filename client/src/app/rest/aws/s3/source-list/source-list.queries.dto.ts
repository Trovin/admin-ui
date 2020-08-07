export class S3SourceListQueriesDto {
	name: string;

	constructor(data?: S3SourceListQueriesDto) {
		if(!data) {
			return;
		}

		this.name = data.name;
	}
}
