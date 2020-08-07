import { environment } from '@environments/environment';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/internal/Subscription';

import { AuthService } from '@core/auth';
import { AuthPermissionsDto } from '@core/auth/auth.permission.dto';
import { UserService } from '@core/user/user.service';
import { Containers, ResourceType } from '@config/containers.enum';

import { PermissionAction } from '@enums/permission-actions.enum';
import { PermissionsEffect } from '@enums/permission-effects.enum';

import { ModalsService } from './modal/modals.service';

@Component({
	selector: 'user-details',
	templateUrl: './details.html',
	providers:[ModalsService]
})

export class UserDetailsComponent implements OnInit, OnDestroy {
	private sub = new Subscription();

	userName: string;
	userEmail: string;
	logoutInProcess = false;
	containers = Containers;
	permissionAction = PermissionAction;
	permissionsEffect = PermissionsEffect;

	isShowRequestPermissionBtn = false;

	availableResources: ResourceType[] = [];
	notAvailableResources: ResourceType[] = [];
	resources: ResourceType[] = [];

	constructor(
		private router: Router,
		private userService: UserService,
		private authService: AuthService,
		private modalsService: ModalsService
	) {
		this.resources = this.containers.getResourceList();
	}

	ngOnInit() {
		const userSub = this.userService
			.getUserInfoSubj()
			.subscribe((info) => {
				this.userName = info.name;
				this.userEmail = info.email;
			});

		this.sub.add(userSub);

		const permissionsSub = this.authService
			.getPermission().subscribe(data => {
				if(!data || !data.length) {
					this.isShowRequestPermissionBtn = true;
					return;
				}

				const processedResources = this.composeResources(data);
				this.mappingResources(processedResources);
			});

		this.sub.add(permissionsSub);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	logout() {
		this.logoutInProcess = true;
		this.authService.logout()
			.subscribe(
				() => this.router.navigate(['public']),
				() => this.logoutInProcess = false
			);
	}

	openRequestPermissionModal() {
		const unavailableResources = this.resources.filter(item => item.resource !== Containers.ANY && item.permissions.some(perm => !perm.allow && perm.exist));

		this.modalsService.openViewModal(unavailableResources, this.userEmail, this.userName);
	}

	private mappingResources(list: ResourceType[]) {
		this.resources = this.mergeArrays([this.resources, list], 'resource');
		const allResource = this.resources.find(item => item.resource === Containers.ANY);
		const allowForAllPermissions = allResource.permissions.filter(perm => perm.allow);

		this.resources.forEach(item => {
			const allItemPermissions = item.permissions.find(item => item.name === PermissionAction.ALL);
			item.permissions = item.permissions.map(perm => {
				if(allowForAllPermissions.some(item => item.name === perm.name || item.name === PermissionAction.ALL) || allItemPermissions.allow || !environment.authorizationEnabled) {
					perm.allow = !perm.deny;
				}

				if(!perm.allow) {
					this.isShowRequestPermissionBtn = true;
				}

				return perm;
			});

			const isAllowResource = item.permissions.some(perm => perm.name === PermissionAction.VIEW && perm.allow);
			isAllowResource ? this.availableResources.push(item) : this.notAvailableResources.push(item);
		});
	}

	private composeResources(data: AuthPermissionsDto[]): ResourceType[] {
		return data
			.sort((a, b) => a.eft.localeCompare(b.eft))
			.reduce<ResourceType[]>((accumulator, key) => {
				key.obj.forEach(item => {
					const resource = this.resources.find(i => i.resource === item);
					if(!resource) {
						return;
					}

					const permissions = resource.permissions.map(permission => {
						const list = key.act as string[];
						if(list.includes(permission.name)) {
							permission.allow = key.eft === PermissionsEffect.ALLOW;
							permission.deny = key.eft === PermissionsEffect.DENY;
						}

						return permission;
					});

					const existResource = accumulator.find(i => i.resource === item);

					if(existResource) {
						existResource.permissions = this.mergeArrays([existResource.permissions, permissions], 'name');
					} else {
						accumulator.push({
							resource: item,
							permissions: permissions,
							description: this.containers.getNormalizeValues(item).description
						});
					}
				});

				return accumulator;
			}, []);
	}

	// TODO: add input types or replace method
	private mergeArrays(arrays: any[], prop: string): any[] {
		const merged = {};

		arrays.forEach(arr => {
			arr.forEach(item => {
				merged[item[prop]] = Object.assign({}, merged[item[prop]], item);
			});
		});

		return Object.values(merged);
	}
}
