export class EventTypesDto {
	eventId: string;

	constructor(data?: EventTypesDto) {
		if(!data) {
			return;
		}

		this.eventId = data.eventId;
	}
}
