import { PipelineErrorsGroupDto } from '@rest/monitoring-sources/pipeline-errors-group';

export class PipelineErrorsGroupModel extends PipelineErrorsGroupDto {
	checked: boolean;

	constructor(data?: PipelineErrorsGroupModel) {
		super(data);
		if(data) {
			this.checked = data.checked;
		}
	}
}
