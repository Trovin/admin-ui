import { PermissionAction } from '@enums/permission-actions.enum';

export class AuthPermissionsDto {
	eft: string;
	obj: string[];
	attr?: string[];
	act: PermissionAction[];

	constructor(data?: AuthPermissionsDto) {
		if (!data) {
			return;
		}

		this.eft = data.eft;
		this.obj = data.obj;
		this.attr = data.attr;
		this.act = data.act;
	}
}
