import { PermissionAction } from '@enums/permission-actions.enum';

export enum Containers {
	ANY = '*',
	DASHBOARD = 'DASHBOARD',
	PIPELINES = 'PIPELINES',
	POST_PROCESSING = 'POST_PROCESSING',
	DB_TO_DB_RECON = 'DB_TO_DB_RECON',
	REDSHIFT_DDL = 'REDSHIFT_DDL',
	REDSHIFT_STATUS = 'REDSHIFT_STATUS',
	MISSING_CONFIGS = 'MISSING_CONFIGS',
	UNKNOWN_FIELDS = 'UNKNOWN_FIELDS',
	DATAMARTS_EMPTY_RECORDS = 'DATAMARTS_EMPTY_RECORDS',
	BATCH_DATA = 'BATCH_DATA',
	TRANSFER_DATA = 'TRANSFER_DATA',
	REDSHIFT_DATA = 'REDSHIFT_DATA',
	PIPELINES_CONFIGS = 'PIPELINES_CONFIGS',
	S3_ALARMS_CONFIGS = 'S3_ALARMS_CONFIGS',
	S3_UPLOADER_TOOL = 'S3_UPLOADER_TOOL',
	CUSTOM_REPLAY_TOOL = 'CUSTOM_REPLAY_TOOL',
	REDSHIFT_VIEWER_TOOL = 'REDSHIFT_VIEWER_TOOL',
	REDSHIFT_DDL_DIFF_TOOL = 'REDSHIFT_DDL_DIFF_TOOL',
	REDSHIFT_CONFIG_TOOL = 'REDSHIFT_CONFIG_TOOL',
	INPUT_FILES = 'INPUT_FILES',
	SOURCE_CATALOG = 'SOURCE_CATALOG',
	SUBSCRIPTIONS = 'SUBSCRIPTIONS',
	DIDIX_OPERATIONS = 'DIDIX_OPERATIONS'
}

export type PermissionType = {
	name: string;
	exist: boolean;
	allow: boolean;
	deny: boolean;
};

export type ResourceType = {
	resource: string;
	permissions: PermissionType[];
	description: string;
};

type ContainerPermissionsModel = {
	container: Containers;
	permissions: PermissionAction[];
	permissionsToView: PermissionAction[];
	description: string;
};

export namespace Containers {
	export const VALUES: ContainerPermissionsModel[] = [
		{
			container: Containers.ANY,
			permissions: [PermissionAction.ALL],
			permissionsToView: [PermissionAction.ALL],
			description: 'ALL'
		},
		{
			container: Containers.DASHBOARD,
			permissions: [PermissionAction.VIEW],
			permissionsToView: [PermissionAction.VIEW],
			description: 'Dashboard'
		},
		{
			container: Containers.PIPELINES,
			permissions: [PermissionAction.VIEW, PermissionAction.UPDATE],
			permissionsToView: [PermissionAction.VIEW],
			description: 'Pipelines'
		},
		{
			container: Containers.POST_PROCESSING,
			permissions: [PermissionAction.VIEW],
			permissionsToView: [PermissionAction.VIEW],
			description: 'Post Processing'
		},
		{
			container: Containers.DB_TO_DB_RECON,
			permissions: [PermissionAction.VIEW],
			permissionsToView: [PermissionAction.VIEW],
			description: 'Db-to-Db Reconciliation'
		},
		{
			container: Containers.REDSHIFT_DDL,
			permissions: [PermissionAction.VIEW],
			permissionsToView: [PermissionAction.VIEW],
			description: 'Redshift DDL'
		},
		{
			container: Containers.REDSHIFT_STATUS,
			permissions: [PermissionAction.VIEW],
			permissionsToView: [PermissionAction.VIEW],
			description: 'Redshift Status'
		},
		{
			container: Containers.MISSING_CONFIGS,
			permissions: [PermissionAction.VIEW],
			permissionsToView: [PermissionAction.VIEW],
			description: 'Missing Configurations'
		},
		{
			container: Containers.UNKNOWN_FIELDS,
			permissions: [PermissionAction.VIEW, PermissionAction.UPDATE],
			permissionsToView: [PermissionAction.VIEW],
			description: 'Unknown fields'
		},
		{
			container: Containers.DATAMARTS_EMPTY_RECORDS,
			permissions: [PermissionAction.VIEW, PermissionAction.UPDATE],
			permissionsToView: [PermissionAction.VIEW],
			description: 'Empty records in Datamarts'
		},
		{
			container: Containers.BATCH_DATA,
			permissions: [PermissionAction.VIEW, PermissionAction.UPDATE, PermissionAction.DELETE],
			permissionsToView: [PermissionAction.VIEW],
			description: 'Batch Data App'
		},
		{
			container: Containers.TRANSFER_DATA,
			permissions: [PermissionAction.VIEW, PermissionAction.UPDATE, PermissionAction.DELETE],
			permissionsToView: [PermissionAction.VIEW],
			description: 'Data Transfer'
		},
		{
			container: Containers.REDSHIFT_DATA,
			permissions: [PermissionAction.VIEW, PermissionAction.UPDATE, PermissionAction.DELETE],
			permissionsToView: [PermissionAction.VIEW],
			description: 'Redshift Data Load'
		},
		{
			container: Containers.PIPELINES_CONFIGS,
			permissions: [PermissionAction.VIEW, PermissionAction.UPDATE, PermissionAction.DELETE, PermissionAction.CREATE],
			permissionsToView: [PermissionAction.VIEW],
			description: 'Pipelines Configurations'
		},
		{
			container: Containers.S3_ALARMS_CONFIGS,
			permissions: [PermissionAction.VIEW, PermissionAction.UPDATE, PermissionAction.DELETE, PermissionAction.CREATE],
			permissionsToView: [PermissionAction.VIEW],
			description: 'S3 Alarms Configurations'
		},
		{
			container: Containers.S3_UPLOADER_TOOL,
			permissions: [PermissionAction.VIEW, PermissionAction.CREATE],
			permissionsToView: [PermissionAction.VIEW],
			description: 'S3 Uploader'
		},
		{
			container: Containers.CUSTOM_REPLAY_TOOL,
			permissions: [PermissionAction.VIEW, PermissionAction.CREATE, PermissionAction.DELETE],
			permissionsToView: [PermissionAction.VIEW],
			description: 'Custom Replay Tool'
		},
		{
			container: Containers.REDSHIFT_VIEWER_TOOL,
			permissions: [PermissionAction.VIEW],
			permissionsToView: [PermissionAction.VIEW],
			description: 'Redshift DB viewer'
		},
		{
			container: Containers.REDSHIFT_DDL_DIFF_TOOL,
			permissions: [PermissionAction.VIEW],
			permissionsToView: [PermissionAction.VIEW],
			description: 'Redshift DDL Diff Tool'
		},
		{
			container: Containers.REDSHIFT_CONFIG_TOOL,
			permissions: [PermissionAction.VIEW],
			permissionsToView: [PermissionAction.VIEW],
			description: 'Redshift Config Generator'
		},
		{
			container: Containers.INPUT_FILES,
			permissions: [PermissionAction.VIEW, PermissionAction.UPDATE],
			permissionsToView: [PermissionAction.VIEW],
			description: 'Input files'
		},
		{
			container: Containers.SOURCE_CATALOG,
			permissions: [PermissionAction.VIEW, PermissionAction.UPDATE],
			permissionsToView: [PermissionAction.VIEW],
			description: 'Source catalog'
		},
		{
			container: Containers.SUBSCRIPTIONS,
			permissions: [PermissionAction.VIEW, PermissionAction.CREATE, PermissionAction.UPDATE, PermissionAction.DELETE],
			permissionsToView: [PermissionAction.VIEW],
			description: 'Notification subscriptions'
		},
		{
			container: Containers.DIDIX_OPERATIONS,
			permissions: [PermissionAction.VIEW, PermissionAction.CREATE, PermissionAction.UPDATE, PermissionAction.DELETE],
			permissionsToView: [PermissionAction.VIEW],
			description: 'Didix operations'
		}
	];

	export function getValues(container: Containers): ContainerPermissionsModel {
		return VALUES.find(i => i.container === container);
	}

	export function getNormalizeValues(value: string): ContainerPermissionsModel {
		return VALUES.find(i => normalizeKey(i.container) === value);
	}

	export function normalizeKey(key: Containers|string = '') {
		return key.replace(/[-_\.]/gi, '').toLowerCase();
	}

	export function getResourceList(): ResourceType[] {
		return VALUES.reduce<ResourceType[]>((accumulator, resource) => {
			const permissions = Object.values(PermissionAction).map(item => {
				return {
					name: item,
					exist: resource.permissions.includes(item),
					allow: false,
					deny: false
				} as PermissionType;
			});

			accumulator.push({
				resource: normalizeKey(resource.container),
				permissions: permissions,
				description: resource.description
			});

			return accumulator;
		}, []).sort((a, b) => a.description.localeCompare(b.description));
	}
}
