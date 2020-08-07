import { PipelineProcessProcessInputDto } from './pipeline-process-input.dto';
import { PipelineProcessProcessOutputDto } from './pipeline-process-output.dto';

export class PipelineProcessDto {
	inputData: PipelineProcessProcessInputDto;
	outputData: PipelineProcessProcessOutputDto[] = [];

	constructor(data?: PipelineProcessDto) {
		if(!data) {
			return;
		}
		this.inputData = new PipelineProcessProcessInputDto(data.inputData);
		this.outputData = data.outputData.map(i => new PipelineProcessProcessOutputDto(i));
	}
}
