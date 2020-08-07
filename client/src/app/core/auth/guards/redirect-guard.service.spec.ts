import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { OktaAuthService } from '@okta/okta-angular';

import { expect } from 'chai';

import * as sinon from 'sinon';

import { RedirectGuard } from './redirect-guard.service';
import { AuthService } from './../auth.service';
import { oktaConfig } from './../okta/okta.config';

class AuthServiceMock extends AuthService {}

describe('RedirectGuard', () => {
	const sandbox = sinon.createSandbox();

	let routerStub = null;
	let redirectGuard: RedirectGuard;
	let auth: AuthServiceMock;
	let oktaAuthService: OktaAuthService;

	beforeEach((() => {
		routerStub = sandbox.createStubInstance(Router);
		oktaAuthService = new OktaAuthService(oktaConfig, routerStub);
		auth = new AuthServiceMock(oktaAuthService);
		redirectGuard = new RedirectGuard(routerStub, auth);
	}));

	afterEach(() => {
		auth = null;
		redirectGuard = null;
		sandbox.restore();
	});

	it('should navigate to portal/dashboard page and return true', (done) => {
		sandbox.stub(OktaAuthService.prototype, 'isAuthenticated').returns(Promise.resolve(true));

		const sub = redirectGuard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{url: ''})
			.subscribe(
				(status) => {
					sub.unsubscribe();

					if(status) {
						sinon.assert.calledWith(routerStub.navigate, ['/portal/dashboard']);
						expect(status).to.equal(true);
						done();
					} else {
						done('error');
					}
				}
			);
	});

	it('should navigate to public page and return false', (done) => {
		sandbox.stub(OktaAuthService.prototype, 'isAuthenticated').returns(Promise.resolve(false));

		const sub = redirectGuard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{url: ''})
			.subscribe(
				(status) => {
					sub.unsubscribe();

					if(status) {
						done('error');
					} else {
						sinon.assert.calledWith(routerStub.navigate, ['/public']);
						expect(status).to.equal(false);
						done();
					}
				}
			);
	});
});
