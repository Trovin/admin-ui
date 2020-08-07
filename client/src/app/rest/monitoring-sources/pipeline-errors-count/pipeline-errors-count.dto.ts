export class PipelineErrorsCountDto {
	name: string;
	totalErrorsCount: number;

	constructor(pipelineErrorDetailsData?: PipelineErrorsCountDto) {
		if(!pipelineErrorDetailsData) {
			return;
		}

		Object.assign(this, pipelineErrorDetailsData);
	}
}
