import { DateRangeColumnType } from '@enums/date-range-column-type.enum';

export class PipelinePendingEventsQueriesDto {
	sourceApplication: string;
	dateFrom: string;
	dateTo: string;
	dateRangeColumnType?: DateRangeColumnType;

	constructor(data?: PipelinePendingEventsQueriesDto) {
		if(!data) {
			return;
		}

		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
		this.sourceApplication = data.sourceApplication;
		this.dateRangeColumnType = data.dateRangeColumnType;
	}
}
