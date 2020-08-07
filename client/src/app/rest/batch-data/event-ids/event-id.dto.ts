export class BatchDataEventIdDto {
	eventIds: string[];

	constructor(data?: BatchDataEventIdDto) {
		if(!data) {
			return;
		}

		this.eventIds = data.eventIds;
	}
}
