export class ReconciliationStateDto {
	active: boolean;
	sourceApplication: string;
	eventId: string;

	constructor(data?: ReconciliationStateDto) {
		if(!data) {
			return;
		}

		this.active = data.active;
		this.sourceApplication = data.sourceApplication;
		this.eventId = data.eventId;
	}
}
