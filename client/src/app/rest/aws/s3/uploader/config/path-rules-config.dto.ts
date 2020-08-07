export class S3UploaderPathRulesConfigDto {
	header: string[];

	constructor(data?: S3UploaderPathRulesConfigDto) {
		if(!data) {
			return;
		}

		this.header = data.header;
	}
}
