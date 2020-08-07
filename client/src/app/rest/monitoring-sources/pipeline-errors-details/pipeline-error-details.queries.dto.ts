import { PipelineProcessOperationType } from '@enums/pipeline-process-operation-type.enum';
import { PipelineType } from '@enums/pipeline-type.enum';
import { DateRangeColumnType } from '@enums/date-range-column-type.enum';

export class PipelineErrorDetailsQueriesDto {
	sourceApplication: string;
	processOperation?: PipelineProcessOperationType;
	runId?: string;
	dateFrom?: string;
	dateTo?: string;
	pipeline?: PipelineType;
	shortErrorMessage: string;
	partial?: boolean;
	dateRangeColumnType?: DateRangeColumnType;

	constructor(data?: PipelineErrorDetailsQueriesDto) {
		if(!data) {
			return;
		}

		this.sourceApplication = data.sourceApplication;
		this.processOperation = data.processOperation;
		this.runId = data.runId;
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
		this.pipeline = PipelineType[data.pipeline];
		this.shortErrorMessage = data.shortErrorMessage;
		this.partial = data.partial;
		this.dateRangeColumnType = DateRangeColumnType[data.dateRangeColumnType];
	}
}
