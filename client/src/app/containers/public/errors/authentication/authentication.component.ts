import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { AuthService } from '@core/auth';

@Component({
	selector: 'errors-authentication',
	templateUrl: './authentication.html'
})
export class ErrorsAuthenticationComponent implements OnInit, OnDestroy {
	private sub = new Subscription();

	errorMessage: string;

	constructor(
		private authService: AuthService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		this.navigateUserByAuthentication();
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	login() {
		this.authService.login();
	}

	logout() {
		this.authService.logout();
	}

	private navigateUserByAuthentication() {

		const sub = this.authService.isAuthenticated()
			.subscribe(status => {
				if(status) {
					this.router.navigateByUrl('/public');
					return;
				}

				this.authService.handleAuthentication()
					.subscribe(
						() => {
							this.router.navigateByUrl('/portal/dashboard');
						},
						e => {
							this.errorMessage = this.route.snapshot.queryParams.errorMessage || e.message;
						}
					);
			});

		this.sub.add(sub);
	}
}
