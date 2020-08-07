import { Component, Output, OnDestroy, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/internal/Subscription';

import { PermissionAction } from '@enums/permission-actions.enum';
import { Containers } from '@config/containers.enum';

import { AuthService } from '@core/auth';
import { UserService } from '@core/user/user.service';

import { environment } from '@environments/environment';

@Component({
	selector: 'portal-header',
	templateUrl: './header.html',
	styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnDestroy {
	@Output() toggledSidebar = new EventEmitter<never>();

	private sub = new Subscription();

	permission = PermissionAction;
	containers = Containers;

	host = environment.host;
	userName = '';

	constructor(
		private router: Router,
		private userService: UserService,
		private authService: AuthService
	) {
		const sub = this.userService.getUserInfoSubj()
			.subscribe((info) => {
				this.userName = info.name;
			});

		this.sub.add(sub);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	toggleSidebar() {
		this.toggledSidebar.emit();
	}

	navigateTo(page: string) {
		this.router.navigate(['/portal', 'user', page]);
	}

	logout() {
		this.authService.logout()
			.subscribe(() => this.router.navigate(['public']));
	}
}
