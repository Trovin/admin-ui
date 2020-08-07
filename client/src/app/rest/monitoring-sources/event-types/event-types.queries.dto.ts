import { DateRangeColumnType } from '@enums/date-range-column-type.enum';

export class MonitoringEventTypesQueriesDto {
	dateFrom: string;
	dateTo: string;
	dateRangeColumnType: DateRangeColumnType;

	constructor(data?: MonitoringEventTypesQueriesDto) {
		if(!data) {
			return;
		}

		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
		this.dateRangeColumnType = DateRangeColumnType[data.dateRangeColumnType];
	}
}
