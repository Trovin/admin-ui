export class AuditOutputProcessBaseQueriesDto {
	runId?: string;
	page?: number;

	constructor(data?: AuditOutputProcessBaseQueriesDto) {

		if(!data) {
			return;
		}

		this.runId = data.runId;
		this.page = data.page;
	}
}
