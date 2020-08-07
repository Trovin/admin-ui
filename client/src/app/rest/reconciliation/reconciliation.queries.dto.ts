export class ReconciliationQueriesDto {
	page?: number;
	itemsPerPage?: number;
	dateFrom?: string;
	dateTo?: string;
	sourceApplication?: string[];
	eventType?: string;
	withDiscrepancy?: boolean;

	constructor(data?: ReconciliationQueriesDto) {
		if(!data) {
			return;
		}
		this.page = data.page;
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
		this.itemsPerPage = data.itemsPerPage;
		this.sourceApplication = data.sourceApplication;
		this.eventType = data.eventType;
		this.withDiscrepancy = data.withDiscrepancy;
	}
}
