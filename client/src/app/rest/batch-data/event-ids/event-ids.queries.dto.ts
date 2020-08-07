export class BatchDataEventIdsQueriesDto {
	sourceApplication?: string;

	constructor(data?: BatchDataEventIdsQueriesDto) {
		if(!data) {
			return;
		}
		this.sourceApplication = data.sourceApplication;
	}
}
