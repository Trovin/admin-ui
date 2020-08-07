import { TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment';

import { Observable, of } from 'rxjs';
import { expect } from 'chai';

import { OktaAuthService } from '@okta/okta-angular';

import { AuthService } from '@core/auth/auth.service';
import { AuthPermissionsDto } from '@core/auth/auth.permission.dto';
import { PermissionAction } from '@enums/permission-actions.enum';
import { PermissionsEffect } from '@enums/permission-effects.enum';

import { Containers } from '@config/containers.enum';

import { PermissionsService } from './permissions.service';


class OktaServiceMock {
	$authenticationState = of(true);
}

environment.authorizationEnabled = true;

const authServiceMock = (permissions: AuthPermissionsDto[]) => {
	return class MockAuthService {
		getPermission(): Observable<AuthPermissionsDto[]> {
			return of(permissions);
		}
	};
};

const serviceInstance = (permissions: AuthPermissionsDto[]): PermissionsService => {
	TestBed.configureTestingModule({
		providers: [
			PermissionsService,
			AuthService,
			{provide: AuthService, useClass: authServiceMock(permissions)},
			{provide: OktaAuthService, useClass: OktaServiceMock}
		]
	});

	return TestBed.get(PermissionsService);
};

const allowOnePermissionsMock = [
	{
		obj: [Containers.BATCH_DATA],
		act: [PermissionAction.VIEW],
		eft: PermissionsEffect.ALLOW
	}
];

const denyOnePermissionsMock = [
	{
		obj: [Containers.BATCH_DATA],
		act: [PermissionAction.VIEW],
		eft: PermissionsEffect.DENY
	}
];

const allowAndDenyPermissionsMock = [
	{
		obj: [Containers.BATCH_DATA],
		act: [PermissionAction.VIEW],
		eft: PermissionsEffect.DENY
	}
];

const allowAllPermissionsMock = [
	{
		obj: ['*'],
		act: [PermissionAction.ALL],
		eft: PermissionsEffect.ALLOW
	}
];

describe('getPermitSubj()', () => {
	it('should return true if correctly handled effect allow', (done) => {
		const service = serviceInstance(allowOnePermissionsMock);
		service.getPermitSubj(Containers.BATCH_DATA, [PermissionAction.VIEW]).subscribe(allowed => {
			expect(allowed).to.equal(true);
			done();
		});
	});

	it('should return true if input permissions has two items', (done) => {
		const service = serviceInstance(allowOnePermissionsMock);
		service.getPermitSubj(Containers.BATCH_DATA, [PermissionAction.VIEW, PermissionAction.CREATE]).subscribe(allowed => {
			expect(allowed).to.equal(true);
			done();
		});
	});

	it('should return false if input container is not correct', (done) => {
		const service = serviceInstance(allowOnePermissionsMock);
		service.getPermitSubj(Containers.ANY, [PermissionAction.VIEW]).subscribe(allowed => {
			expect(allowed).to.equal(false);
			done();
		});
	});

	it('should return true if user has permissions for all containers', (done) => {
		const service = serviceInstance(allowAllPermissionsMock);
		service.getPermitSubj(Containers.BATCH_DATA, [PermissionAction.VIEW]).subscribe(allowed => {
			expect(allowed).to.equal(true);
			done();
		});
	});

	it('should return true if user has permissions for all containers', (done) => {
		const service = serviceInstance(allowAllPermissionsMock);
		service.getPermitSubj(Containers.ANY, [PermissionAction.ALL]).subscribe(allowed => {
			expect(allowed).to.equal(true);
			done();
		});
	});

	it('should return false if correctly handled effect deny for one container', (done) => {
		const service = serviceInstance(denyOnePermissionsMock);
		service.getPermitSubj(Containers.BATCH_DATA, [PermissionAction.VIEW]).subscribe(allowed => {
			expect(allowed).to.equal(false);
			done();
		});
	});

	it('should return false if correctly handled effect deny', (done) => {
		const service = serviceInstance(denyOnePermissionsMock);
		service.getPermitSubj(Containers.ANY, [PermissionAction.VIEW]).subscribe(allowed => {
			expect(allowed).to.equal(false);
			done();
		});
	});
});

describe('getPermit()', () => {
	it('should return true if correctly handled effect allow', () => {
		const service = serviceInstance(allowOnePermissionsMock);
		expect(service.getPermit(Containers.BATCH_DATA, [PermissionAction.VIEW])).to.equal(true);
	});

	it('should return false if container is ANY', () => {
		const service = serviceInstance(allowOnePermissionsMock);
		expect(service.getPermit(Containers.ANY, [PermissionAction.VIEW])).to.equal(false);
	});

	it('should return false if input container is not correct', () => {
		const service = serviceInstance(denyOnePermissionsMock);
		expect(service.getPermit(Containers.PIPELINES, [PermissionAction.VIEW])).to.equal(false);
	});

	it('should return false if correctly handled effect deny', () => {
		const service = serviceInstance(denyOnePermissionsMock);
		expect(service.getPermit(Containers.BATCH_DATA, [PermissionAction.VIEW])).to.equal(false);
	});

	it('should return false if correctly handled priority between allow and deny effect', () => {
		const service = serviceInstance(allowAndDenyPermissionsMock);
		expect(service.getPermit(Containers.BATCH_DATA, [PermissionAction.VIEW])).to.equal(false);
	});
});
