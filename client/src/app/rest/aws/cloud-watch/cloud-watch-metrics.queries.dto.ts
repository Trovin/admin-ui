export class CloudWatchMetricsQueriesDto {
	namespace: string;
	metricName: string;
	startTime: string;
	endTime: string;
	period: number;
	statistics: string;
	scanBy: string;

	constructor(data?: CloudWatchMetricsQueriesDto) {
		if(!data) {
			return;
		}
		Object.assign(this, data);
	}
}
