export class S3BucketDto {
	name: string;

	constructor(data?: S3BucketDto) {
		if(!data) {
			return;
		}

		this.name = data.name;
	}
}
