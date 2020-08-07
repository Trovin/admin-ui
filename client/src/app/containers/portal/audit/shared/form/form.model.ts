import { DateRangeType } from '@enums/date-range-type.enum';
import { AuditSearchType } from '@enums/audit-search-type.enum';
import { PipelineType } from '@enums/pipeline-type.enum';

export class AuditStatsBaseFormModel {
	dateRange?: DateRangeType;
	dateFrom?: string;
	dateTo?: string;
	sourceApplication?: string[];
	search?: string;
	searchTypes?: AuditSearchType[];
	dateRangeColumnType?: string;
	withErrorsOnly: boolean;
	pipeline?: PipelineType;
	eventId?: string;
	partial?: boolean;

	constructor(data?: AuditStatsBaseFormModel) {
		if(!data) {
			return;
		}

		this.dateRange = data.dateRange;
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
		this.sourceApplication = data.sourceApplication;
		this.dateRangeColumnType = data.dateRangeColumnType;
		this.withErrorsOnly = data.withErrorsOnly;
		this.pipeline = PipelineType[data.pipeline];
		this.search = data.search;
		this.searchTypes = data.searchTypes ? data.searchTypes.map(e => AuditSearchType[e]) : [];
		this.eventId = data.eventId;
		this.partial = data.partial;
	}
}
