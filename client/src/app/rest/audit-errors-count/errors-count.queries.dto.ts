import { PipelineType } from '@enums/pipeline-type.enum';
import { DateRangeType } from '@enums/date-range-type.enum';
import { AuditSearchType } from '@enums/audit-search-type.enum';

export class AuditErrorsCountQueriesDto {
	dateRange: DateRangeType;
	dateFrom?: string;
	dateTo?: string;
	dateRangeColumnType?: string;
	pipeline?: PipelineType;
	sourceApplication?: string;
	eventId?: string;
	search?: string;
	searchTypes?: AuditSearchType[];
	withErrorsOnly: boolean;

	constructor(data?: AuditErrorsCountQueriesDto) {
		if(!data) {
			return;
		}
		this.pipeline = PipelineType[data.pipeline];
		this.dateRange = data.dateRange;
		this.dateFrom = data.dateFrom;
		this.dateRangeColumnType = data.dateRangeColumnType;
		this.dateTo = data.dateTo;
		this.sourceApplication = data.sourceApplication;
		this.eventId = data.eventId;
		this.search = data.search;
		this.searchTypes = data.searchTypes ? data.searchTypes.map(e => AuditSearchType[e]) : [];
		this.withErrorsOnly = data.withErrorsOnly;
	}
}
