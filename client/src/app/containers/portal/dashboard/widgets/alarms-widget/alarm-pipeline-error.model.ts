import { AlarmPipelineErrorDto } from '@rest/alarm-pipeline-errors';

export class AlarmPipelineErrorModel extends AlarmPipelineErrorDto {
	errorDetailsLink: string;
	errorDetailsParams: any;

	constructor(data?: AlarmPipelineErrorModel) {
		super(data);
		if(!data) {
			return;
		}

		this.errorDetailsLink = data.errorDetailsLink;
		this.errorDetailsParams = data.errorDetailsParams;
	}
}
