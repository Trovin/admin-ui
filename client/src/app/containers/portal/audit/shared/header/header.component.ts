import { Component, Input, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { AuditHeaderNavigationModel } from './header-navigation.model';

@Component({
	selector: 'audit-header',
	templateUrl: './header.html'
})

export class AuditHeaderComponent implements OnChanges, OnDestroy {
	private sub = new Subscription();

	@Input() title = '';
	@Input() sourceApplication: string[] = [];
	@Input() navigation: AuditHeaderNavigationModel[] = [];

	ngOnChanges(changes: SimpleChanges) {
		if(changes.sourceApplication) {
			this.sourceApplication = changes.sourceApplication.currentValue;
			this.configNavItemVisibility();
		}
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	private configNavItemVisibility() {
		this.navigation.forEach((item: AuditHeaderNavigationModel) => {
			const isPermissionValid = this.validateItemPermissions(item);
			item.isVisible = !item.permissions.length || isPermissionValid;
		});
	}

	private validateItemPermissions(item: AuditHeaderNavigationModel) {
		if(!this.sourceApplication) {
			return false;
		}
		const sourceApplications = this.sourceApplication
			.filter(e => {
				const data = e.split(',');
				return item.permissions.some(item => !!~data.indexOf(item));
			});

		return !!sourceApplications.length;
	}
}
