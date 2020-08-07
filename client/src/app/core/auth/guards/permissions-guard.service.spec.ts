import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { OktaAuthService } from '@okta/okta-angular';
import { expect } from 'chai';

import * as sinon from 'sinon';

import { PermissionsGuard } from './permissions-guard.service';
import { PermissionsService } from './../../permissions/permissions.service';

import { AuthService } from './../auth.service';
import { Observable } from 'rxjs';
import { oktaConfig } from './../okta/okta.config';

class AuthServiceMock extends AuthService {}
class PermissionsServiceMock extends PermissionsService {}

describe('PermissionsGuard', () => {
	const sandbox = sinon.createSandbox();

	let routerStub = null;
	let permissionsGuard: PermissionsGuard;
	let auth: AuthServiceMock;
	let permissionsService: PermissionsServiceMock;
	let oktaAuthService: OktaAuthService;

	beforeEach((() => {
		routerStub = sandbox.createStubInstance(Router);
		oktaAuthService = new OktaAuthService(oktaConfig, routerStub);
		auth = new AuthServiceMock(oktaAuthService);
		permissionsService = new PermissionsServiceMock(auth);
		permissionsGuard = new PermissionsGuard(permissionsService, routerStub);
	}));

	afterEach(() => {
		sandbox.restore();
	});

	it('should return false if the route dont have any permissions', (done) => {
		const routeMock = new ActivatedRouteSnapshot();
		routeMock.data = {};

		const sub = permissionsGuard.canActivate(routeMock).subscribe((status: boolean) => {
			expect(status).to.equal(false);
			done();
		});
	});

	it('should return true if have some permissions', (done) => {
		const routeMock = new ActivatedRouteSnapshot();
		const permissionsMock = Observable.create(observer => {
			observer.next(true);
			observer.complete();
		});

		sandbox.stub(permissionsService, 'getPermitSubj').returns(permissionsMock);

		routeMock.data = {
			permissions: ['view'],
			container: 'PIPELINES'
		};

		const sub = permissionsGuard.canActivate(routeMock).subscribe((status: boolean) => {
			expect(status).to.equal(true);
			done();
		});
	});

	it('should redirect to "/no-permissions" page if permissions is invalid', (done) => {
		const routeMock = new ActivatedRouteSnapshot();
		const permissionsMock = Observable.create(observer => {
			observer.next(false);
			observer.complete();
		});

		routeMock.data = {
			permissions: ['view'],
			container: 'PIPELINES'
		};

		sandbox.stub(permissionsService, 'getPermitSubj').returns(permissionsMock);

		const sub = permissionsGuard.canActivate(routeMock)
			.subscribe((status: boolean) => {
				if(status) {
					done('error');
				} else {
					const navigationExtras = {
						replaceUrl: false
					};

					sinon.assert.calledWith(routerStub.navigateByUrl, '/no-permissions', navigationExtras);
					expect(status).to.equal(false);
					done();
				}
			});
	});
});
