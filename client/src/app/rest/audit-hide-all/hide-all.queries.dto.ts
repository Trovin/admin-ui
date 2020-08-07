import { PipelineType } from '@enums/pipeline-type.enum';
import { AuditSearchType } from '@enums/audit-search-type.enum';

export class AuditHideAllQueriesDto {
	dateFrom?: string;
	dateTo?: string;
	dateRangeColumnType?: string;
	pipeline?: PipelineType;
	sourceApplication?: string[];
	eventId?: string;
	search?: string;
	searchTypes?: AuditSearchType[];
	withErrorsOnly?: boolean;

	constructor(data?: AuditHideAllQueriesDto) {
		if(!data) {
			return;
		}

		this.pipeline = data.pipeline;
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
		this.dateRangeColumnType = data.dateRangeColumnType;
		this.sourceApplication = data.sourceApplication;
		this.eventId = data.eventId;
		this.search = data.search;
		this.searchTypes = data.searchTypes ? data.searchTypes.map(e => AuditSearchType[e]) : [];
		this.withErrorsOnly = data.withErrorsOnly;
	}
}
