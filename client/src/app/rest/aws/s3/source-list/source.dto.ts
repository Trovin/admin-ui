export class S3SourceDto {
	name: string;

	constructor(data?: S3SourceDto) {
		if(!data) {
			return;
		}

		this.name = data.name;
	}
}
