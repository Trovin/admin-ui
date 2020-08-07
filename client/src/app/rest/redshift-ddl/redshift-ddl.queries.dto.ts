import { DateRangeType } from '@enums/date-range-type.enum';

export class RedshiftDdlQueriesDto {
	page?: number;
	search?: string;
	dateRangeColumnType?: string;
	dateRange?: DateRangeType;
	dateFrom?: string;
	dateTo?: string;

	constructor(data?: RedshiftDdlQueriesDto) {
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
