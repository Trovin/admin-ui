import { DateRangeColumnType } from './../../enums/date-range-column-type.enum';

export class RedshiftEmptyRecordsQueriesDto {
	page?: number;
	showIgnore: boolean;
	dateFrom?: string;
	dateTo?: string;
	dateRangeColumnType?: DateRangeColumnType;

	constructor(data?: RedshiftEmptyRecordsQueriesDto) {
		if(!data) {
			return;
		}

		this.page = data.page;
		this.showIgnore = data.showIgnore;
		this.dateRangeColumnType = data.dateRangeColumnType;
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
	}
}
