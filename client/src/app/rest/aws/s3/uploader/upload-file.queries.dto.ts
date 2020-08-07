export class S3UploaderQueriesDto {
	formData: FormData;
	key: string;
	bucket?: string;
	bucketConfigKey?: string;
	url: string;
	autoUpload: boolean;
	enableValidate?: boolean;

	constructor(data?: S3UploaderQueriesDto) {
		if(!data) {
			return;
		}

		this.formData = data.formData;
		this.key = data.key;
		this.bucket = data.bucket;
		this.url = data.url;
		this.autoUpload = data.autoUpload;
		this.bucketConfigKey = data.bucketConfigKey;
		this.enableValidate = data.enableValidate;
	}
}
