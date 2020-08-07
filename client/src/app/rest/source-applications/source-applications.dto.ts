import { PipelineType } from '@enums/pipeline-type.enum';

export class SourceApplicationDto {
	sourceApplication: string;
	pipeline: PipelineType;

	constructor(data?: SourceApplicationDto) {
		if(!data) {
			return;
		}

		this.sourceApplication = data.sourceApplication;
		this.pipeline = PipelineType[data.pipeline];
	}
}
