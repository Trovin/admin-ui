export class AuditHideQueriesDto {
	runIds: string[];

	constructor(data?: AuditHideQueriesDto) {
		if(!data) {
			return;
		}
		this.runIds = data.runIds;
	}
}
