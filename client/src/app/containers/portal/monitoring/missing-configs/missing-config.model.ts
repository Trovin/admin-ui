
import { MissingConfigDto } from '@rest/missing-configs';

export class MissingConfigModel extends MissingConfigDto {
	s3Url: string;
	deleteInProcess: boolean;

	constructor(data?: MissingConfigModel) {
		super(data);

		if(!data) {
			return;
		}

		this.s3Url = data.s3Url;
		this.deleteInProcess = data.deleteInProcess;
	}
}