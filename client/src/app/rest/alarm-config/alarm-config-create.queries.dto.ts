export class AlarmConfigCreateQueriesDto {
	bucket: string;
	sourcePrefix: string;
	cronExpression: string;
	durationHours: number;
	active: boolean;
	customSnsTopicArn: string;

	constructor(data?: AlarmConfigCreateQueriesDto) {
		if(!data) {
			return;
		}

		this.sourcePrefix = data.sourcePrefix;
		this.bucket = data.bucket;
		this.cronExpression = data.cronExpression;
		this.durationHours = data.durationHours;
		this.active = data.active;
		this.customSnsTopicArn = data.customSnsTopicArn;
	}
}
