export class ReconciliationDto {
	start_date: Date;
	end_date: Date;
	source_application: string[];
	source_count: number;
	source_eventtype: string;
	target_count: number;

	constructor(data?: ReconciliationDto) {
		if(!data) {
			return;
		}

		Object.assign(this, data);
	}
}
