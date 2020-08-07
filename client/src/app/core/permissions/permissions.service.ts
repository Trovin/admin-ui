import { Injectable } from '@angular/core';

import { AsyncSubject, Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Containers } from '@config/containers.enum';
import { PermissionAction } from '@enums/permission-actions.enum';
import { environment } from '@environments/environment';

import { AuthService } from './../auth/auth.service';
import { AuthPermissionsDto } from './../auth/auth.permission.dto';

type PermissionsStorage = {
	allow: Map<string, PermissionAction[]>,
	deny: Map<string, PermissionAction[]>
};

@Injectable()
export class PermissionsService {
	private permissionsSubj = new AsyncSubject<PermissionsStorage>();
	private permissionsStorage: PermissionsStorage = {
		allow: new Map<string, PermissionAction[]>(),
		deny: new Map<string, PermissionAction[]>()
	};

	constructor(
		private auth: AuthService) {
		this.init();
	}

	getPermit(key: Containers, permissions: PermissionAction[]) {
		if (!key) {
			return this.disabled;
		}

		const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];
		return this.permit(this.permissionsStorage, key, requiredPermissions);
	}

	getPermitSubj(key: Containers, permissions: PermissionAction[] = []): Observable<boolean> {
		if (!key) {
			return of(this.disabled);
		}

		return this.permissionsSubj
			.pipe(
				map(store => this.permit(store, key, permissions))
			);
	}

	private get disabled() {
		return !environment.authorizationEnabled;
	}

	private init() {
		this.auth.getPermission().subscribe(data => {
			this.permissionsStorage = this.processPermissions(data);
			this.permissionsSubj.next(this.permissionsStorage);
			this.permissionsSubj.complete();
		});
	}

	private processPermissions(data: AuthPermissionsDto[]): PermissionsStorage {
		const allowed = data.filter(item => item.eft === 'allow');
		const deny = data.filter(item => item.eft === 'deny');
		return {
			allow: this.convertPermissions(allowed),
			deny: this.convertPermissions(deny)
		};
	}

	private convertPermissions(permissions: AuthPermissionsDto[]) {
		const result = new Map<string, PermissionAction[]>();
		permissions.forEach(item => {
			const permissions = item.act;

			item.obj.forEach(key => {
				const name = this.normalizeKey(key);
				const existingPermissions = result.get(name) || [];
				result.set(name, [...existingPermissions, ...permissions]);
			});
		});

		return result;
	}

	private normalizeKey(key: Containers|string = '') {
		return key.replace(/[-_\.]/gi, '').toLowerCase();
	}

	private permit(storage: PermissionsStorage, key: Containers, permissions: PermissionAction[]) {
		const name = this.normalizeKey(key);

		if (this.disabled) {
			return true;
		}

		if (this.deny(storage, name, permissions)) {
			return false;
		}

		return this.allow(storage, name, permissions);
	}

	private allow(storage: PermissionsStorage, name: string, permissions: PermissionAction[]) {
		const allowed = storage.allow;
		const entityPermissions = allowed.get(name) || allowed.get(Containers.ANY) || [];
		const result = entityPermissions.includes(PermissionAction.ALL);

		return result || entityPermissions.some(item => permissions.includes(item));
	}

	private deny(storage: PermissionsStorage, name: string, permissions: PermissionAction[]) {
		const deny = storage.deny;
		if (!deny || !deny.size) {
			return false;
		}

		const denyPermissions = deny.get(name) || deny.get(Containers.ANY) || [];
		const result = denyPermissions.includes(PermissionAction.ALL);

		return result || denyPermissions.some(item => permissions.includes(item));
	}
}
