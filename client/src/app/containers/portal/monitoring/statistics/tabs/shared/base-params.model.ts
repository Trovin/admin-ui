import { DateRangeType } from '@enums/date-range-type.enum';
import { DateRangeColumnType } from '@enums/date-range-column-type.enum';

export class MonitoringStatsBaseParamsModel {
	dateRange: DateRangeType;
	dateFrom: string;
	dateTo: string;
	dateRangeColumnType: DateRangeColumnType;
	page: number;

	constructor(data?: MonitoringStatsBaseParamsModel) {
		if(!data) {
			return;
		}
		this.dateRange = DateRangeType[data.dateRange];
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
		this.dateRangeColumnType = DateRangeColumnType[data.dateRangeColumnType];
		this.page = data.page;
	}
}
