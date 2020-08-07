export class AlarmConfigUpdateQueriesDto {
	bucket: string;
	sourcePrefix: string;
	cronExpression: string;
	durationHours: number;

	currentStatus: string;
	alarmSent: number;
	nextCheckDate: string;
	lastCheckDate: string;
	active: string;

	changedSourcePrefix: string;
	changedBucket: string;

	customSnsTopicArn: string;

	constructor(data?: AlarmConfigUpdateQueriesDto) {
		if(!data) {
			return;
		}

		this.sourcePrefix = data.sourcePrefix;
		this.bucket = data.bucket;
		this.cronExpression = data.cronExpression;
		this.durationHours = data.durationHours;

		this.currentStatus = data.currentStatus;
		this.alarmSent = data.alarmSent;
		this.nextCheckDate = data.nextCheckDate;
		this.lastCheckDate = data.lastCheckDate;
		this.active = data.active;

		this.changedSourcePrefix = data.changedSourcePrefix;
		this.changedBucket = data.changedBucket;

		this.customSnsTopicArn = data.customSnsTopicArn;
	}
}
