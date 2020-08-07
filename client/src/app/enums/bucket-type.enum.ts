import { environment } from '@environments/environment';

export enum BucketType {
	BATCH = 'BATCH',
	HISTORICAL_BATCH = 'HISTORICAL_BATCH',
	HISTORICAL_STAGE = 'HISTORICAL_STAGE',
	STAGE = 'STAGE',
	INTERMEDIATE = 'INTERMEDIATE',
	FLATTENED = 'FLATTENED'
}

interface BucketTypeDataModel {
	type: BucketType;
	bucket: string;
}

export namespace BucketType {
	export const VALUES: BucketTypeDataModel[] = [
		{
			type: BucketType.BATCH,
			bucket: environment.awsConfig.s3.batchBucket
		},
		{
			type: BucketType.HISTORICAL_BATCH,
			bucket: environment.awsConfig.s3.historicalBatchBucket
		},
		{
			type: BucketType.HISTORICAL_STAGE,
			bucket: environment.awsConfig.s3.historicalStageBucket
		},
		{
			type: BucketType.STAGE,
			bucket: environment.awsConfig.s3.stageBucket
		},
		{
			type: BucketType.INTERMEDIATE,
			bucket: environment.awsConfig.s3.intermediateBucket
		},
		{
			type: BucketType.FLATTENED,
			bucket: environment.awsConfig.s3.flattenedBucket
		}
	];

	export function getBucketConfig(type: BucketType): BucketTypeDataModel {
		return VALUES.find(i => i.type === type);
	}

	export function getBucketName(type: BucketType): string {
		const bucketType = this.getBucketConfig(type);
		return bucketType.bucket;
	}
}
