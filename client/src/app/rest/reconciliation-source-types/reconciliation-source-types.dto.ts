export class ReconciliationSourceTypesDto {
	sourceApplication: string;
	eventId: string;

	constructor(data?: ReconciliationSourceTypesDto) {
		if(!data) {
			return;
		}

		Object.assign(this, data);
	}
}
