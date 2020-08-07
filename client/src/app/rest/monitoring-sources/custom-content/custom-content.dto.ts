import { PipelinePageType } from '@enums/pipeline-page-type.enum';

export class PipelineCustomContentDto {
	content: string;
	userEmail: string;
	key: PipelinePageType;

	constructor(data?: PipelineCustomContentDto) {
		if(!data) {
			return;
		}
		this.key = data.key;
		this.userEmail = data.userEmail;
		this.content = data.content;
	}
}
