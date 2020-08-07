export class AlarmConfigDto {
	bucket: string;
	sourcePrefix: string;
	cronExpression: string;
	durationHours: number;
	active: boolean;

	currentStatus?: string;
	nextCheckDate?: string;
	cronDescription?: string;
	alarmSent?: number;
	lastCheckDate?: string;

	changedSourcePrefix?: string;
	changedBucket?: string;

	customSnsTopicArn: string;

	selected?: boolean;
	disabled?: boolean;
	loading?: boolean;

	constructor(data?: AlarmConfigDto) {
		if(!data) {
			return;
		}

		this.currentStatus = data.currentStatus;
		this.durationHours = data.durationHours;
		this.nextCheckDate = data.nextCheckDate;
		this.cronDescription = data.cronDescription;
		this.sourcePrefix = data.sourcePrefix;
		this.alarmSent = data.alarmSent;
		this.lastCheckDate = data.lastCheckDate;
		this.cronExpression = data.cronExpression;
		this.changedSourcePrefix = data.changedSourcePrefix;
		this.changedBucket = data.changedBucket;
		this.customSnsTopicArn = data.customSnsTopicArn;
		this.bucket = data.bucket;
		this.selected = data.selected;
		this.active = data.active;
		this.disabled = data.disabled;
		this.loading = data.loading;
	}
}
