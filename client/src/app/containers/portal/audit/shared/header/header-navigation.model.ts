import { PipelineType } from '@enums/pipeline-type.enum';

export class AuditHeaderNavigationModel {
	title: string;
	href: string[];
	isVisible: boolean;
	e2e: string;
	permissions: PipelineType[];

	constructor(data?: AuditHeaderNavigationModel) {
		if(!data) {
			return;
		}

		this.title = data.title;
		this.href = data.href;
		this.isVisible = data.isVisible;
		this.e2e = data.e2e;
		this.permissions = data.permissions.map(e => PipelineType[e]);
	}
}