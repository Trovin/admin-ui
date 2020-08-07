import { DateRangeColumnType } from '@enums/date-range-column-type.enum';
import { PipelineProcessOperationType } from '@enums/pipeline-process-operation-type.enum';

export class PipelineErrorsGroupQueriesDto {
	sourceApplication: string;
	dateFrom?: string;
	dateTo?: string;
	shortErrorMessage?: string;
	processOperation?: PipelineProcessOperationType;
	partial?: boolean;
	dateRangeColumnType?: DateRangeColumnType;
	runId?: string;

	constructor(data?: PipelineErrorsGroupQueriesDto) {
		if(!data) {
			return;
		}
		this.sourceApplication = data.sourceApplication;
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
		this.shortErrorMessage = data.shortErrorMessage;
		this.processOperation = data.processOperation;
		this.partial = data.partial;
		this.dateRangeColumnType = DateRangeColumnType[data.dateRangeColumnType];
		this.runId = data.runId;
	}
}
