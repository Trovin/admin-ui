import { DateRangeType } from '@enums/date-range-type.enum';

export class ReconciliationBaseModel {
	page?: number;
	itemsPerPage?: number;
	dateRange?: DateRangeType;
	dateFrom?: string;
	dateTo?: string;
	sourceApplication?: string[];
	eventType?: string;
	withDiscrepancy?: boolean;

	constructor(data?: ReconciliationBaseModel) {
		if(!data) {
			return;
		}

		this.page = data.page;
		this.dateRange = DateRangeType[data.dateRange];
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
		this.itemsPerPage = data.itemsPerPage;
		this.sourceApplication = data.sourceApplication;
		this.eventType = data.eventType;
		this.withDiscrepancy = data.withDiscrepancy;
	}
}
