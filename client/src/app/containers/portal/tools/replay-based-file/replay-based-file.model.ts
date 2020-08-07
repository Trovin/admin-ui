import { S3ReplayFileDto } from '@rest/aws/s3/replay-files';

export class S3ReplayBasedFileModel extends S3ReplayFileDto {
	replayInProcess: boolean;
	deleteInProcess: boolean;

	constructor(data?: S3ReplayBasedFileModel) {
		super(data);
		if(!data) {
			return;
		}

		this.replayInProcess = data.replayInProcess;
		this.deleteInProcess = data.deleteInProcess;
	}
}
