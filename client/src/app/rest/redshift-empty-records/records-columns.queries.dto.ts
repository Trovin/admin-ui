import { DateRangeColumnType } from './../../enums/date-range-column-type.enum';

export class RedshiftEmptyRecordsColumnsQueriesDto {
	showIgnore: boolean;
	dateFrom?: string;
	dateTo?: string;
	dateRangeColumnType?: DateRangeColumnType;

	constructor(data?: RedshiftEmptyRecordsColumnsQueriesDto) {
		if(!data) {
			return;
		}

		this.showIgnore = data.showIgnore;
		this.dateRangeColumnType = data.dateRangeColumnType;
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
	}
}
