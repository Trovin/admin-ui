export class AlarmConfigActiveQueriesDto {
	bucket: string;
	sourcePrefix: string;
	active: boolean;

	constructor(data?: AlarmConfigActiveQueriesDto) {
		if(!data) {
			return;
		}

		this.sourcePrefix = data.sourcePrefix;
		this.bucket = data.bucket;
		this.active = data.active;
	}
}
