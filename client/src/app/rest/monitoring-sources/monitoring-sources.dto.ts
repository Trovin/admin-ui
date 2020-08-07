export class MonitoringSourcesDto {
	sourceApplication: string;
	rawFilesCount: number;
	eventsCount: number;
	errorsCount: number;
	latencyAverage: number;
	missingConfigsCount: number;

	constructor(data?: MonitoringSourcesDto) {
		if(!data) {
			return;
		}

		this.sourceApplication = data.sourceApplication;
		this.rawFilesCount = data.rawFilesCount;
		this.eventsCount = data.eventsCount;
		this.errorsCount = data.errorsCount;
		this.latencyAverage = data.latencyAverage;
		this.missingConfigsCount = data.missingConfigsCount;
	}
}
