import { EnvironmentType } from './environment-type.enum';

export enum BucketConfigKey {
	DB_VIEWER = 'DB_VIEWER',
	PIPELINE_CONFIGS = 'PIPELINE_CONFIGS',
	FILES_STORAGE = 'FILES_STORAGE',
	VALIDATE = 'VALIDATE'
}

type BucketConfigModel = {
	bucketConfigKey: BucketConfigKey,
	bucketProduction: string,
	bucketIntegration: string
};

export namespace BucketConfigKey {
	export const VALUES: BucketConfigModel[] = [
		{
			bucketConfigKey: BucketConfigKey.DB_VIEWER,
			bucketProduction: 'bhn-galaxy-temp-db-viewer-unload-us-west-2',
			bucketIntegration: 'bhn-galaxy-temp-db-viewer-unload-integration-us-west-2'
		},
		{
			bucketConfigKey: BucketConfigKey.PIPELINE_CONFIGS,
			bucketProduction: 'production-bhn-galaxy-configurations',
			bucketIntegration: 'integration-bhn-galaxy-configurations'
		},
		{
			bucketConfigKey: BucketConfigKey.FILES_STORAGE,
			bucketProduction: 'integration-bhn-datalake-files-storage-us-west-2',
			bucketIntegration: 'integration-bhn-datalake-files-storage-us-west-2'
		},
		{
			bucketConfigKey: BucketConfigKey.VALIDATE,
			bucketProduction: 'production-bhn-datalake-manually-load-temp-us-west-2',
			bucketIntegration: 'integration-bhn-datalake-manually-load-temp-us-west-2'
		}
	];

	export function getBucketConfig(bucketConfigKey: BucketConfigKey): BucketConfigModel {
		return VALUES.find(i => i.bucketConfigKey === bucketConfigKey);
	}

	export function getBucketName(bucketConfigKey: BucketConfigKey, env: string): string {
		const config = this.getBucketConfig(bucketConfigKey);
		const bucketName = EnvironmentType[env] === EnvironmentType.production ? config.bucketProduction : config.bucketIntegration;

		return bucketName;
	}
}
