import { PipelineProcessType } from '@enums/pipeline-process-type.enum';

export class PipelinePendingEventsDto {
	pipelineProcess: PipelineProcessType;
	pendingEvents: number;

	constructor(data?: PipelinePendingEventsDto) {
		if(!data) {
			return;
		}
		this.pipelineProcess = PipelineProcessType[data.pipelineProcess];
		this.pendingEvents = data.pendingEvents;
	}
}