export class PipelineProcessProcessOutputDto {
	name: string;
	errorsCount: number;
	eventsCount: number;
	rawFilesCount: number;

	constructor(data?: PipelineProcessProcessOutputDto) {
		if(!data) {
			return;
		}
		Object.assign(this, data);
	}
}
