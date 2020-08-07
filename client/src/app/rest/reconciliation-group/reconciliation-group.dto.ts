export class ReconciliationGroupDto {
	source_application: string;
	source_count: number;
	target_count: number;

	constructor(data?: ReconciliationGroupDto) {
		if(!data) {
			return;
		}

		Object.assign(this, data);
	}
}
