import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

import { filter } from 'rxjs/operators';

import { Containers } from '@config/containers.enum';

import { PermissionAction } from '@enums/permission-actions.enum';
import { PermissionsService } from './../permissions.service';

type PermissionsType = {
	container: Containers;
	permissions: PermissionAction[];
};

@Directive({
	selector: '[permissions]'
})
export class PermissionsDirective {
	@Input() set permissions({ container, permissions }: PermissionsType) {
		this.permissionList = permissions || [];
		this.container = container;
		this.getAccess();
	}

	private hasView = false;
	private container: Containers;
	private permissionList: PermissionAction[] = [];

	constructor (
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef,
		private permissionsService: PermissionsService
	) {}

	private getAccess() {
		if (!this.container) {
			this.renderView();
		}

		this.permissionsService.getPermitSubj(this.container, this.permissionList)
			.pipe(
				filter(() => !this.hasView)
			)
			.subscribe(isAllowed => isAllowed ? this.renderView() : this.viewContainer.clear());
	}

	private renderView() {
		this.viewContainer.createEmbeddedView(this.templateRef);
		this.hasView = true;
	}
}
