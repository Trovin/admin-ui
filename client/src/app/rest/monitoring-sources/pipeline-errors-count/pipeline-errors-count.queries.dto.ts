import { DateRangeColumnType } from '@enums/date-range-column-type.enum';

export class PipelineErrorsCountQueriesDto {
	sourceApplication: string;
	dateFrom?: string;
	dateTo?: string;
	dateRangeColumnType?: DateRangeColumnType;

	constructor(data?: PipelineErrorsCountQueriesDto) {
		if(!data) {
			return;
		}
		this.sourceApplication = data.sourceApplication;
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
		this.dateRangeColumnType = data.dateRangeColumnType;
	}
}
