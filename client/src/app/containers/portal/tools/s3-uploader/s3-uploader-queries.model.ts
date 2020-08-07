import { S3BucketFilesQueriesDto } from '@rest/aws/s3/bucket-files';

export class S3UploaderQueriesModel extends S3BucketFilesQueriesDto {
	bucket?: string;
	path?: string;
	key?: string;

	constructor(data?: S3UploaderQueriesModel) {
		super(data);

		if(!data) {
			return;
		}

		this.bucket = data.bucket;
		this.path = data.path;
		this.key = data.key;
	}
}
