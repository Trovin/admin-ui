import { PipelinePageType } from '@enums/pipeline-page-type.enum';

export class PipelineCustomContentQueriesDto {
	key: PipelinePageType;
	userEmail?: string;
	content?: string;
	userId?: string;
	userName?: string;

	constructor(data?: PipelineCustomContentQueriesDto) {
		if(!data) {
			return;
		}
		this.content = data.content;
		this.userEmail = data.userEmail;
		this.key = PipelinePageType[data.key];
		this.userId = data.userId;
		this.userName = data.userName;
	}
}
