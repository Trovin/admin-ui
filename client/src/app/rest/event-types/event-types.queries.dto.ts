import { PipelineType } from '@enums/pipeline-type.enum';

export class EventTypesQueriesDto {
	sourceApplication?: string;
	pipeline?: PipelineType;

	constructor(data?: EventTypesQueriesDto) {
		if(!data) {
			return;
		}
		this.sourceApplication = data.sourceApplication;
		this.pipeline = data.pipeline;
	}
}
