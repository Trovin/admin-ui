export class MonitoringPipelineOverviewModel {
	title: string;
	errorsCount: number;
	pendingEventsCount: number;
	pendingEventsPageUrl: string;
	errorDetailsPageUrl: string;

	constructor(data?: MonitoringPipelineOverviewModel) {
		if(!data) {
			return;
		}

		this.title = data.title;
		this.errorsCount = data.errorsCount;
		this.pendingEventsCount = data.pendingEventsCount;
		this.pendingEventsPageUrl = data.pendingEventsPageUrl;
		this.errorDetailsPageUrl = data.errorDetailsPageUrl;
	}
}
