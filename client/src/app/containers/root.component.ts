import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { AuthService } from '@core/auth/auth.service';
import { UserService } from '@core/user/user.service';

import { IIndexUIPageInfo, IIndexPageInfo } from './root.interface';

@Component({
	selector: 'root',
	templateUrl: './root.html'
})
export class RootComponent implements OnInit, OnDestroy {
	private sub = new Subscription();
	private pageInfo: IIndexPageInfo;

	childInjected = false;

	constructor(
		private authService: AuthService,
		private userService: UserService
	) {}

	ngOnInit() {
		const authenticationStateSubj = this.authService.authenticationState()
			.subscribe((status) => {
				this.authService.setAuthenticationSubj(status);
			});
		this.sub.add(authenticationStateSubj);

		const isAuthenticatedSubj = this.authService.isAuthenticated()
			.subscribe((status) => {
				this.authService.setAuthenticationSubj(status);
			});
		this.sub.add(isAuthenticatedSubj);

		const authenticationSubj = this.authService.getAuthenticationSubj()
			.subscribe(status => {
				if(status) {
					this.userService.getUserInfo().subscribe((info) => this.userService.setUserInfoSubj(info));
				} else {
					this.userService.setUserInfoDefaultSubj();
				}
			});
		this.sub.add(authenticationSubj);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	setComponent(component: IIndexUIPageInfo) {
		this.childInjected = true;
		if(!this.pageInfo) {
			return;
		}
		component.setPageInfo(this.pageInfo);
	}
}
