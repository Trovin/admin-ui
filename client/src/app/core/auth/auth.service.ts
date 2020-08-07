import { Injectable } from '@angular/core';

import { OktaConfig } from '@okta/okta-angular/dist/okta/models/okta.config';
import { OktaAuthService, UserClaims } from '@okta/okta-angular';
import * as OktaAuth from '@okta/okta-auth-js';

import { Buffer } from 'buffer';

import { BehaviorSubject, Subject, from } from 'rxjs';

import { environment } from '@environments/environment';

import { QueryParamsType } from '@rest/shared/query-params.type';

import { PermissionAction } from '@enums/permission-actions.enum';
import { PermissionsEffect } from '@enums/permission-effects.enum';
import { AuthPermissionsDto } from './auth.permission.dto';

export const DefaultPermissions = [
	new AuthPermissionsDto({
		obj: ['dashboard'],
		act: [PermissionAction.ALL],
		eft: PermissionsEffect.ALLOW
	})
];

@Injectable()
export class AuthService {
	protected isAuthenticatedSubj = new BehaviorSubject<boolean>(false);
	protected oktaAuth: OktaAuth;
	private oktaConfig: OktaConfig;

	constructor(private oktaAuthService: OktaAuthService) {
		/**
		 * @TODO: temporary solution. Waiting for support loginSilent https://github.com/okta/okta-oidc-js/issues/227
		 */
		this.oktaConfig = this.oktaAuthService.getOktaConfig();
		this.oktaAuth = new OktaAuth(this.oktaConfig);
	}

	isAuthenticated() {
		const subj = new Subject<boolean>();

		this.oktaAuthService.isAuthenticated()
			.then(status => {
				subj.next(status);
				subj.complete();
			})
			.catch(() => subj.error(false));

		return subj;
	}

	getUser(): Promise<UserClaims> {
		return this.oktaAuthService.getUser();
	}

	handleAuthentication() {
		const subj = new Subject<boolean>();

		this.oktaAuthService.handleAuthentication()
			.then(() => {
				subj.next(true);
				subj.complete();
			})
			.catch((e) => subj.error(e));

		return subj;
	}

	authenticationState() {
		const subj = new Subject<boolean>();

		this.oktaAuthService.$authenticationState
			.subscribe(
				status => {
					subj.next(status);
				},
				() => subj.error(false)
			);

		return subj;
	}

	getIdToken() {
		const subj = new Subject<string>();

		from(this.oktaAuthService.getIdToken())
			.subscribe(
				token => {
					subj.next(token);
					subj.complete();
				},
				() => subj.error(null)
			);

		return subj;
	}

	getAccessToken() {
		const subj = new Subject<string>();

		from(this.oktaAuthService.getAccessToken())
			.subscribe(
				token => {
					if (!token) {
						subj.error({status: 401});
						return;
					}

					subj.next(token);
					subj.complete();
				},
				(err) => subj.error(err)
			);

		return subj;
	}

	logout() {
		const subj = new Subject<never>();

		this.oktaAuthService.logout()
			.then(() => {
				subj.next();
				subj.complete();
			})
			.catch(() => subj.error(null));

		return subj;
	}

	login(redirectUri = 'portal/dashboard', redirectQueryParams?: QueryParamsType) {
		this.oktaAuthService.setFromUri(redirectUri, redirectQueryParams);
		this.oktaAuth.token.getWithRedirect(this.getOauthOptions());
	}

	async loginSilent() {
		const tokens = await this.oktaAuth.token.getWithPopup(this.getOauthOptions());
		this.composeTokens(tokens);
	}

	setAuthenticationSubj(status: boolean): void {
		this.isAuthenticatedSubj.next(status);
	}

	getAuthenticationSubj(): BehaviorSubject<boolean> {
		return this.isAuthenticatedSubj;
	}

	getPermission(): Subject<AuthPermissionsDto[]> {
		const subj = new Subject<AuthPermissionsDto[]>();

		from(this.oktaAuthService.getIdToken())
			.subscribe(
				token => {
					const idToken = AuthService.parseJwtToken(token);
					if (!idToken.permissions_policy || !idToken.permissions_policy.statement.length) {
						subj.next(DefaultPermissions);
						subj.complete();
						return;
					}

					const data = idToken.permissions_policy || {};
					const permissions = (data.statement || []).map((data: AuthPermissionsDto) => new AuthPermissionsDto(data));


					subj.next([...permissions, ...DefaultPermissions]);
					subj.complete();
				},
				() => subj.error(null)
			);

		return subj;
	}

	private getOauthOptions() {
		return {
			responseType: ['id_token', 'token'], // to receive idToken, accessToken
			scopes: this.oktaConfig.scope.split(' ')
		};
	}

	private composeTokens(tokens: any[] = []) {
		if (!tokens && !tokens.length) {
			return;
		}

		for (let i = 0; i < tokens.length; i++) {
			if (tokens[i].idToken) {
				this.oktaAuth.tokenManager.add('idToken', tokens[i]);
			}
			if (tokens[i].accessToken) {
				this.oktaAuth.tokenManager.add('accessToken', tokens[i]);
			}
		}
	}

	static parseJwtToken(token: string) {
		if (!token) {
			return {};
		}

		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const decodedBase64 = Buffer.from(base64, 'base64').toString();
		return JSON.parse(decodedBase64);
	}
}
