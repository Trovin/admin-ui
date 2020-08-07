export class PipelineErrorsGroupDto {
	shortMessage: string;
	errorsCount: number;

	constructor(data?: PipelineErrorsGroupDto) {
		if(!data) {
			return;
		}

		this.shortMessage = data.shortMessage;
		this.errorsCount = data.errorsCount;
	}
}
