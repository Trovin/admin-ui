export enum Permission {
	GALAXY_ADMIN = 'GALAXY_ADMIN',
	GALAXY_DATALAKE = 'GALAXY_DATALAKE',
	GALAXY_READ_ONLY = 'GALAXY_READ_ONLY',
	GALAXY_SUPERUSER = 'GALAXY_SUPERUSER'
}

export type PermissionValuesModel = {
	permission: Permission;
	groupName: string;
};

export namespace Permission {
	export const VALUES: PermissionValuesModel[] = [
		{permission: Permission.GALAXY_ADMIN, groupName: 'Galaxy Admin'},
		{permission: Permission.GALAXY_DATALAKE, groupName: 'Galaxy Datalake'},
		{permission: Permission.GALAXY_READ_ONLY, groupName: 'Galaxy Read Only'},
		{permission: Permission.GALAXY_SUPERUSER, groupName: 'Galaxy Superuser'}
	];

	export function getValuesByGroupName(groupName: string): PermissionValuesModel {
		return VALUES.find(i => i.groupName === groupName);
	}

	export function getValuesByPermission(permission: Permission): PermissionValuesModel {
		return VALUES.find(i => i.permission === permission);
	}
}
