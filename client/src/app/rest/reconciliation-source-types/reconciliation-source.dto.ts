export class ReconciliationSourceDto {
	name: string;
	eventTypes?: string[];

	constructor(data?: ReconciliationSourceDto) {
		if(!data) {
			return;
		}

		this.name = data.name;
		this.eventTypes = data.eventTypes;
	}
}
