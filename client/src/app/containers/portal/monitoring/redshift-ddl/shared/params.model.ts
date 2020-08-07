import { DateRangeType } from '@enums/date-range-type.enum';
import { DateRangeColumnType } from '@enums/date-range-column-type.enum';

export class MonitoringRedshiftDdlParamsModel {
	page?: number;
	search?: string;
	dateRangeColumnType?: DateRangeColumnType;
	dateRange?: DateRangeType;
	dateFrom?: string;
	dateTo?: string;

	constructor(data?: MonitoringRedshiftDdlParamsModel) {
		if(!data) {
			return;
		}

		this.page = data.page;
		this.search = data.search;
		this.dateRangeColumnType = data.dateRangeColumnType;
		this.dateRange = data.dateRange;
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
	}
}