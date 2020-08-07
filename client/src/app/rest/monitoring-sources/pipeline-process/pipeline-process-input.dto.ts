export class PipelineProcessProcessInputDto {
	errorsCount: number;
	eventsCount: number;
	rawFilesCount: number;

	constructor(data?: PipelineProcessProcessInputDto) {
		if(!data) {
			return;
		}
		Object.assign(this, data);
	}
}
