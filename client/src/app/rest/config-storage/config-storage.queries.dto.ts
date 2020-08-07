export class ConfigStorageQueriesDto {
	sourceApplication: string;
	eventId: string;

	constructor(data?: ConfigStorageQueriesDto) {
		if(!data) {
			return;
		}

		this.sourceApplication = data.sourceApplication;
		this.eventId = data.eventId;
	}
}
