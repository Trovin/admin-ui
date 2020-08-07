export class S3BucketFileModel {
	Key?: string;
	LastModified?: Date;
	template?: string;
	process?: boolean;
	selected?: boolean;

	constructor(data?: S3BucketFileModel) {
		if(!data) {
			return;
		}

		Object.assign(this, data);
	}
}
