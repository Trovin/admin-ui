export class BatchDataBucketFileDownloadDto {
	body: File;

	constructor(data?: BatchDataBucketFileDownloadDto) {
		if(!data) {
			return;
		}

		this.body = data.body;
	}
}
