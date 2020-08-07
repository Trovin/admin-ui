import { Component, ViewChild } from '@angular/core';

import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { AuthService } from '@core/auth';

import { alertsService } from '@components/ui';

import { SidebarComponent } from './sidebar/sidebar.component';

import { IIndexUIPageInfo, IIndexPageInfo } from './../root.interface';

import { environment } from '@environments/environment';
import { EnvironmentType } from '@enums/environment-type.enum';

@Component({
	selector: 'portal',
	templateUrl: './portal.html',
	styleUrls: ['./portal.scss']
})

export class PortalComponent implements IIndexUIPageInfo {
	@ViewChild(SidebarComponent, {static: true}) sidebar: SidebarComponent;

	open = true;

	environment = environment;
	environmentType = EnvironmentType;

	pageInfo: IIndexPageInfo;

	isIntegration = this.environment.env === this.environmentType.integration;

	constructor(private authService: AuthService) {}

	loginSilent() {
		from(this.authService.loginSilent())
			.pipe(
				mergeMap(() => this.authService.isAuthenticated().asObservable())
			)
			.subscribe(
				status => {
					this.authService.setAuthenticationSubj(status);
					status ? alertsService.success('Authorized') : alertsService.error('Not Authorized');
				},
				(err) => alertsService.error(err)
			);
	}

	toggleSidebar() {
		this.open = !this.open;
		this.sidebar.toggleMenuItems();
	}

	setPageInfo(info: IIndexPageInfo) {
		this.pageInfo = info;
	}
}
