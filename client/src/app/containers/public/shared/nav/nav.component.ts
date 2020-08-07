import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { PermissionAction } from '@enums/permission-actions.enum';
import { Containers } from '@config/containers.enum';

import { AuthService } from '@core/auth/index';
import { UserService } from '@core/user/user.service';

import { environment } from '@environments/environment';

@Component({
	selector: 'admin-nav',
	templateUrl: './nav.html',
	styleUrls: ['./nav.scss'],
	encapsulation: ViewEncapsulation.Emulated
})
export class NavigationComponent implements OnInit, OnDestroy {
	private sub = new Subscription();

	permission = PermissionAction;
	containers = Containers;

	host = environment.host;
	authenticated = false;
	isNavOpen = false;
	userName = '';

	constructor(
		private userService: UserService,
		private authService: AuthService
	) {}

	ngOnInit() {
		this.initSubscriptions();
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	initSubscriptions() {
		const authenticationSubj = this.authService.isAuthenticated()
			.subscribe((status) => {
				this.authenticated = status;
			});

		this.sub.add(authenticationSubj);

		const userInfoSubj = this.userService.getUserInfoSubj()
			.subscribe((info) => {
				this.userName = info.name;
			});
		this.sub.add(userInfoSubj);
	}

	toggleNavigation() {
		this.isNavOpen = !this.isNavOpen;
	}

	login() {
		this.authService.login();
	}

	logout() {
		this.authService
			.logout()
			.subscribe(() => this.authenticated = false);
	}
}
