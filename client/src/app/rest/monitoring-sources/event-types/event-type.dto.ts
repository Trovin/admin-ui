export class MonitoringEventTypeDto {
	eventId: string;
	sourceApplication: string;
	rawFilesCount?: number;
	eventsCount?: number;
	errorsCount?: number;

	constructor(data?: MonitoringEventTypeDto) {
		if(!data) {
			return;
		}
		this.eventId = data.eventId;
		this.sourceApplication = data.sourceApplication;
		this.rawFilesCount = data.rawFilesCount ? +data.rawFilesCount : 0;
		this.eventsCount = data.eventsCount ? +data.eventsCount : 0;
		this.errorsCount = data.errorsCount ? +data.errorsCount : 0;
	}
}
