import { Containers } from '@config/containers.enum';

interface INavigationBase {
	title: string;
	href: string[]|string;
	internal: boolean;
	container?: Containers;
	hide: boolean;
}
export interface INavigationChild extends INavigationBase {
	opened?: boolean;
	active?: boolean;
	children?: INavigationChild[];
}
export interface INavigation extends INavigationBase {
	icon: string;
	opened: boolean;
	active: boolean;
	children: INavigationChild[];
}

export let navmanifest: INavigation[] = [
	{
		title: 'Home',
		icon: 'fa-home',
		href: ['/public'],
		internal: true,
		opened: false,
		active: false,
		hide: false,
		children: []
	},
	{
		title: 'Dashboard',
		icon: 'fa-tachometer',
		href: ['/portal', 'dashboard'],
		internal: true,
		opened: false,
		active: false,
		hide: true,
		children: [],
		container: Containers.DASHBOARD
	},
	{
		title: 'Monitoring',
		icon: 'fa-file-text',
		href: ['/portal', 'monitoring'],
		internal: true,
		opened: false,
		active: false,
		hide: true,
		children: [
			{
				title: 'Pipelines',
				href: ['/portal', 'monitoring', 'pipelines'],
				internal: true,
				hide: true,
				container: Containers.PIPELINES
			},
			{
				title: 'Post Processing',
				href: ['/portal', 'monitoring', 'post-processing'],
				internal: true,
				hide: true,
				container: Containers.POST_PROCESSING
			},
			{
				title: 'Db-to-Db Reconciliation',
				href: ['/portal', 'monitoring', 'db-to-db-reconciliation'],
				internal: true,
				hide: false,
				container: Containers.DB_TO_DB_RECON
			},
			{
				title: 'Redshift DDL',
				href: ['/portal', 'monitoring', 'redshift-ddl'],
				internal: true,
				hide: true,
				container: Containers.REDSHIFT_DDL
			},
			// {
			// 	title: 'Redshift Status',
			// 	href: ['/portal', 'monitoring', 'redshift-status'],
			// 	internal: true,
			// 	hide: true,
			// 	container: Containers.REDSHIFT_STATUS
			// }
			{
				title: 'Missing Configurations',
				href: ['/portal', 'monitoring', 'missing-configurations'],
				internal: true,
				hide: true,
				container: Containers.MISSING_CONFIGS
			},
			{
				title: 'Unknown fields',
				href: ['/portal', 'monitoring', 'not-mapped-fields'],
				internal: true,
				hide: true,
				container: Containers.UNKNOWN_FIELDS
			},
			{
				title: 'Empty records in Datamarts',
				href: ['/portal', 'monitoring', 'redshift-empty-records'],
				internal: true,
				hide: true,
				container: Containers.DATAMARTS_EMPTY_RECORDS
			}
		]
	},
	{
		title: 'Audit',
		icon: 'fa-clipboard',
		href: ['/portal', 'audit'],
		internal: true,
		hide: true,
		opened: false,
		active: false,
		children: [
			{
				title: 'Batch Data App',
				href: ['/portal', 'audit', 'batch'],
				internal: true,
				hide: true,
				container: Containers.BATCH_DATA
			},
			// {
			// 	title: 'Emr Filter Status',
			// 	href: ['/portal', 'audit', 'emr-filter-status'],
			// 	internal: true
			// },
			{
				title: 'Data Transfer',
				href: ['/portal', 'audit', 'data-transfer'],
				internal: true,
				hide: true,
				container: Containers.TRANSFER_DATA
			},
			{
				title: 'Redshift Data Load',
				href: ['/portal', 'audit', 'redshift-data-copy'],
				internal: true,
				hide: true,
				container: Containers.REDSHIFT_DATA
			}
		]
	},
	{
		title: 'Search by tables',
		icon: 'fa-search',
		href: ['/portal', 'redshift-tables'],
		internal: true,
		hide: true,
		opened: false,
		active: false,
		children: [],
		container: Containers.SOURCE_CATALOG
	},
	{
		title: 'Configurations',
		icon: 'fa-cogs',
		href: ['/portal', 'configs'],
		internal: true,
		hide: true,
		opened: false,
		active: false,
		children: [
			{
				title: 'Pipelines',
				href: ['/portal', 'configs', 'pipelines'],
				internal: true,
				hide: true,
				container: Containers.PIPELINES_CONFIGS
			},
			{
				title: 'S3 Alarms',
				href: ['/portal', 'configs', 'alarms'],
				internal: true,
				hide: true,
				container: Containers.S3_ALARMS_CONFIGS
			}
		]
	},
	{
		title: 'Input files',
		icon: 'fa-list-alt',
		href: ['/portal', 'input-files'],
		internal: true,
		hide: true,
		opened: false,
		active: false,
		container: Containers.INPUT_FILES,
		children: []
	},
	{
		title: 'Source catalog',
		icon: 'fa-list',
		href: ['/portal', 'source-catalog'],
		internal: true,
		hide: true,
		opened: false,
		active: false,
		container: Containers.SOURCE_CATALOG,
		children: []
	},
	{
		title: 'Tools',
		icon: 'fa-wrench',
		href: ['/portal', 'tools'],
		internal: true,
		hide: true,
		opened: false,
		active: false,
		children: [
			{
				title: 'S3 Uploader',
				href: ['/portal', 'tools', 's3-uploader'],
				internal: true,
				hide: true,
				container: Containers.S3_UPLOADER_TOOL
			},
			{
				title: 'Custom Replay Tool',
				href: ['/portal', 'tools', 'custom-replay-tool'],
				internal: true,
				hide: true,
				container: Containers.CUSTOM_REPLAY_TOOL
			},
			// {
			// 	title: 'Redshift DB viewer',
			// 	href: ['/portal', 'tools', 'redshift-viewer'],
			// 	internal: true,
			// 	hide: true,
			// 	container: Containers.REDSHIFT_VIEWER_TOOL
			// }
			{
				title: 'Redshift DDL Diff Tool',
				href: ['/portal', 'tools', 'redshift-diff-tool'],
				internal: true,
				hide: true,
				container: Containers.REDSHIFT_DDL_DIFF_TOOL
			},
			{
				title: 'Redshift Config Generator',
				href: ['/portal', 'tools', 'redshift-config-generator'],
				internal: true,
				hide: true,
				container: Containers.REDSHIFT_CONFIG_TOOL
			},
			{
				title: 'DIDIX Maintenance',
				href: ['/portal', 'tools', 'didix-operations'],
				internal: true,
				hide: true,
				container: Containers.DIDIX_OPERATIONS
			}
		]
	}
];
