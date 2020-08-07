export class AlarmPipelineErrorDto {
	sourceApplication: string;
	eventId: string;
	pipeline: string;
	component: string;
	errorsCount: number;
	lastCheckDate: Date;
	firstErrorDate: Date;
	exampleShortErrorMessage: string;

	constructor(data?: AlarmPipelineErrorDto) {
		if(!data) {
			return;
		}

		this.sourceApplication = data.sourceApplication;
		this.eventId = data.eventId;
		this.pipeline = data.pipeline;
		this.component = data.component;
		this.errorsCount = data.errorsCount;
		this.lastCheckDate = data.lastCheckDate;
		this.firstErrorDate = data.firstErrorDate;
		this.exampleShortErrorMessage = data.exampleShortErrorMessage;
	}
}
