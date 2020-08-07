import { DateRangeType } from '@enums/date-range-type.enum';

export class DateRangeDataModel {
	dateRange?: DateRangeType;
	dateFrom?: string;
	dateTo?: string;
	format?: string;
	period?: number;

	constructor(data?: DateRangeDataModel) {
		if(!data) {
			return;
		}
		this.dateRange = DateRangeType[data.dateRange];
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
		this.format = data.format;
		this.period = data.period;
	}
}
