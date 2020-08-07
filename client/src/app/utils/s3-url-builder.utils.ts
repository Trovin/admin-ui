import { environment } from '@environments/environment';

export class S3UrIBuilderUtils {
	static buildS3Url(bucketName: string, objectKey: string, uri?: string): string {
		const defaultUri = environment.awsConfig.s3.uri;
		const currentUri = uri || defaultUri;
		const queries = `region=${environment.awsConfig.region}`;

		if(bucketName && !objectKey) {
			return `${currentUri}/buckets/${bucketName}?${queries}`;
		}

		if(bucketName && objectKey) {
			return objectKey[objectKey.length - 1] === '/' ? `${currentUri}/buckets/${bucketName}/${objectKey}?${queries}` : `${currentUri}/object/${bucketName}/${objectKey}?${queries}`;
		}

		return `${currentUri}?${queries}`;
	}
}