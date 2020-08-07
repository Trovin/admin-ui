export class MissingConfigsDeleteQueriestDto {
	sourceApplication?: string;
	eventId?: string;

	constructor(data?: MissingConfigsDeleteQueriestDto) {
		if(!data) {
			return;
		}

		this.sourceApplication = data.sourceApplication;
		this.eventId = data.eventId;
	}
}
