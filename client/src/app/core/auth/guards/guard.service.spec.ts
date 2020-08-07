import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { OktaAuthService } from '@okta/okta-angular';

import { expect, assert } from 'chai';

import * as sinon from 'sinon';

import { AuthGuard } from './guard.service';
import { AuthService } from './../auth.service';
import { oktaConfig } from './../okta/okta.config';

class AuthServiceMock extends AuthService {}

describe('AuthGuard', () => {
	const sandbox = sinon.createSandbox();

	let routerStub = null;
	let authGuard: AuthGuard;
	let auth: AuthServiceMock;
	let oktaAuthService: OktaAuthService;

	beforeEach((() => {
		routerStub = sandbox.createStubInstance(Router);
		oktaAuthService = new OktaAuthService(oktaConfig, routerStub);
		auth = new AuthServiceMock(oktaAuthService);
		authGuard = new AuthGuard(auth);
	}));

	afterEach(() => {
		auth = null;
		authGuard = null;
		sandbox.restore();
	});

	it('should return true / authenticated', (done) => {
		sandbox.stub(OktaAuthService.prototype, 'isAuthenticated').returns(Promise.resolve(true));
		const sub = authGuard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{url: 'testUrl'})
			.subscribe(
				(status) => {
					sub.unsubscribe();
					if(status) {
						expect(status).to.equal(true);
						done();
					} else {
						done('error');
					}
				}
			);
	});

	it('should navigate to public page and return false / not authenticated', (done) => {
		sandbox.stub(OktaAuthService.prototype, 'isAuthenticated').returns(Promise.resolve(false));
		const spyLogin = sandbox.stub(AuthServiceMock.prototype, 'login').returns();
		const spy = sinon.spy(AuthServiceMock.prototype, 'setAuthenticationSubj');

		const sub = authGuard.canActivate(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{url: 'testUrl'})
			.subscribe(
				(status) => {
					sub.unsubscribe();
					if(status) {
						done('error');
					} else {
						assert(spy.calledWith(false));
						assert(spyLogin.calledWith('testUrl'));
						expect(status).to.equal(false);
						done();
					}
				}
			);
	});
});
