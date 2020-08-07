export class AlarmConfigDeleteQueriesDto {
	bucket: string;
	sourcePrefix: string;

	constructor(data?: AlarmConfigDeleteQueriesDto) {
		if(!data) {
			return;
		}

		this.sourcePrefix = data.sourcePrefix;
		this.bucket = data.bucket;
	}
}
