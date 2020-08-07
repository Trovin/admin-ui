import { EnvironmentType } from './environment-type.enum';

export enum GalaxyBucket {
	BATCH = 'BATCH',
	HISTORICAL_BATCH = 'HISTORICAL_BATCH',
	REAL_TIME = 'REAL_TIME',
	CONFIGURATIONS = 'CONFIGURATIONS'
}

export type GalaxyBucketValuesModel = {
	columnType: GalaxyBucket;
	alias: string;
	integrationBucketName: string;
	productionBucketName: string;
};

export namespace GalaxyBucket {
	export const VALUES: GalaxyBucketValuesModel[] = [
		{
			columnType: GalaxyBucket.BATCH,
			alias: 'batch',
			integrationBucketName: 'integration-bhn-datalake-batchfiles-us-west-2',
			productionBucketName: 'production-bhn-datalake-batchfiles-us-west-2'
		},
		{
			columnType: GalaxyBucket.HISTORICAL_BATCH,
			alias: 'historical-batch',
			integrationBucketName: 'integration-bhn-datalake-batchfiles-historical-us-west-2',
			productionBucketName: 'production-bhn-datalake-batchfiles-historical-us-west-2'
		},
		{
			columnType: GalaxyBucket.REAL_TIME,
			alias: 'real-time',
			integrationBucketName: 'integration-bhn-datalake-intermediate-us-west-2',
			productionBucketName: 'production-bhn-datalake-intermediate-us-west-2'
		}
	];

	export const properties = {
		'batch': GalaxyBucket.BATCH,
		'historical-batch': GalaxyBucket.HISTORICAL_BATCH,
		'real-time': GalaxyBucket.REAL_TIME
	};

	export function getValues(columnType: GalaxyBucket): GalaxyBucketValuesModel {
		return VALUES.find(i => i.columnType === columnType);
	}

	export function getAlias(pipeline: GalaxyBucket): string {
		return Object.keys(properties).find(k => properties[k] === pipeline);
	}

	export function getByAlias(pipelineAlias: string): GalaxyBucket {
		return properties[pipelineAlias];
	}

	export function getBucketName(columnType: GalaxyBucket, env: string): string {
		const config = this.getValues(columnType);
		const bucketName = EnvironmentType[env] === EnvironmentType.production ? config.productionBucketName : config.integrationBucketName;

		return bucketName;
	}
}
