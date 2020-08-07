import { Router } from '@angular/router';

import { OktaAuthService } from '@okta/okta-angular';

import { expect, assert } from 'chai';

import * as sinon from 'sinon';

import { AuthService } from './../auth.service';

import { OktaCallbackGuardService } from './okta-callback-guard.service';
import { oktaConfig } from './okta.config';

class OktaCallbackGuardServiceMock extends OktaCallbackGuardService {}

describe('OktaCallbackGuardService', () => {
	const sandbox = sinon.createSandbox();

	let routerStub = null;
	let authService: AuthService;
	let oktaAuthService: OktaAuthService;
	let oktaCallbackGuardService: OktaCallbackGuardServiceMock;

	beforeEach((() => {
		routerStub = sandbox.createStubInstance<Router>(Router);
		oktaAuthService = new OktaAuthService(oktaConfig, routerStub);
		authService = new AuthService(oktaAuthService);
		oktaCallbackGuardService = new OktaCallbackGuardServiceMock(authService, routerStub);
	}));

	afterEach(() => {
		routerStub = null;
		authService = null;
		oktaCallbackGuardService = null;
		sandbox.restore();
	});

	it('should navigate to public page / user authorized', (done) => {
		sandbox.stub(OktaAuthService.prototype, 'isAuthenticated').returns(Promise.resolve(true));

		const sub = oktaCallbackGuardService.canActivate()
			.subscribe((status: boolean) => {
				sub.unsubscribe();
				if(status) {
					expect(status).to.equal(true);
					done();
				} else {
					done('error');
				}
			});
	});

	it('should handleAuthentication success / user authorized', (done) => {
		sandbox.stub(OktaAuthService.prototype, 'isAuthenticated').returns(Promise.resolve(false));
		sandbox.stub(OktaAuthService.prototype, 'handleAuthentication').returns(Promise.resolve());

		const sub = oktaCallbackGuardService.canActivate()
			.subscribe((status: boolean) => {
				sub.unsubscribe();
				if(status) {
					expect(status).to.equal(true);
					done();
				} else {
					done('error');
				}
			});
	});

	it('should handleAuthentication failed / user unathorized / redirect to "/errors/authentication-error" page', (done) => {
		sandbox.stub(OktaAuthService.prototype, 'isAuthenticated').returns(Promise.resolve(false));
		sandbox.stub(OktaAuthService.prototype, 'handleAuthentication').returns(Promise.reject({message: 'error'}));

		const sub = oktaCallbackGuardService.canActivate()
			.subscribe((status: boolean) => {
				sub.unsubscribe();
				if(status) {
					done('error');
				} else {
					const navigationExtras = {
						queryParams: {
							'errorMessage': 'error'
						},
						queryParamsHandling: 'merge'
					};
					sinon.assert.calledWith(routerStub.navigate, ['/errors/authentication-error'], navigationExtras);
					expect(status).to.equal(false);
					done();
				}
			});
	});
});
