import { PipelineProcessType } from '@enums/pipeline-process-type.enum';

export class PipelinePendingDetailsQueriesDto {
	process: PipelineProcessType;
	sourceApplication: string;
	dateFrom?: string;
	dateTo?: string;
	page: number;

	constructor(data?: PipelinePendingDetailsQueriesDto) {
		if(!data) {
			return;
		}

		this.process = PipelineProcessType[data.process];
		this.sourceApplication = data.sourceApplication;
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
		this.page = data.page;
	}
}