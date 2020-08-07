import { DateRangeColumnType } from '@enums/date-range-column-type.enum';

export class MonitoringSourcesQueriesDto {
	page: number;
	dateFrom: string;
	dateTo: string;
	dateRangeColumnType: DateRangeColumnType;

	constructor(data?: MonitoringSourcesQueriesDto) {
		if(!data) {
			return;
		}
		this.page = data.page;
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
		this.dateRangeColumnType = data.dateRangeColumnType;
	}
}
