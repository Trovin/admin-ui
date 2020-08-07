import { Router } from '@angular/router';
import { OktaAuthService, UserClaims } from '@okta/okta-angular';

import * as sinon from 'sinon';

import { expect, assert } from 'chai';

import { BehaviorSubject, Subscription } from 'rxjs';

import { oktaConfig } from '@core/auth/okta/okta.config';
import { AuthService } from '@core/auth/auth.service';

import { Permission } from '@enums/permission.enum';

import { UserService } from './user.service';

class UserServiceMock extends UserService {
	userInfoSubj = new BehaviorSubject<UserClaims>({} as UserClaims);
	userInfo = {} as UserClaims;

	composeUserInfo(info: UserClaims): UserClaims {
		return super.composeUserInfo(info);
	}

	composeADGroups(info: UserClaims): string[] {
		return super.composeADGroups(info);
	}

	setUserInfo(info: UserClaims) {
		super.setUserInfo(info);
	}
}

describe('UserService', () => {
	const sandbox = sinon.createSandbox();

	let routerStub = null;
	let userService: UserServiceMock;
	let oktaAuthService: OktaAuthService;

	beforeEach((() => {
		routerStub = sandbox.createStubInstance(Router);
		oktaAuthService = new OktaAuthService(oktaConfig, routerStub);
		const authService = new AuthService(oktaAuthService);
		userService = new UserServiceMock(authService);
	}));

	afterEach(() => {
		userService = null;
		sandbox.restore();
	});

	describe('getUserInfoSubj()', () => {
		const subj = new Subscription();

		afterEach(() => {
			subj.unsubscribe();
		});

		it('should return subject with default user info', (done) => {
			const sub = userService.getUserInfoSubj()
				.subscribe((info) => {
					expect(info).to.deep.equal({});
					done();
				});

			subj.add(sub);
		});

		it('should return subject with user info', (done) => {
			const userInfo = {
				sub: '00ufgargot0U1cUP00h7',
				ADGroups: [Permission.getValuesByPermission(Permission.GALAXY_ADMIN).groupName]
			} as UserClaims;

			userService.setUserInfoSubj(userInfo);
			const sub = userService.getUserInfoSubj()
				.subscribe((info) => {
					expect(info).to.deep.equal(userInfo);
					done();
				});

			subj.add(sub);
		});
	});

	describe('setUserInfoSubj()', () => {
		it('should set user info to userInfo property and to userInfoSubj', () => {
			const spySetUserInfo = sinon.spy(UserServiceMock.prototype, 'setUserInfo');
			const userInfo = {
				sub: '00ufgargot0U1cUP00h7',
				ADGroups: [Permission.getValuesByPermission(Permission.GALAXY_ADMIN).groupName]
			} as UserClaims;

			userService.setUserInfoSubj(userInfo);

			assert(spySetUserInfo.calledWith(userInfo));
			userService.userInfoSubj.value.should.eql(userInfo);
		});
	});

	describe('getUserInfo()', () => {
		it('should return user information / user info defined', (done) => {
			const user: UserClaims = {
				sub: '00ugvdlmqkRPxB4gt0h7',
				email: 'test@gmail.com',
				email_verified: true,
				name: 'andrew kharsun'
			};
			sandbox.stub(AuthService.prototype, 'getUser').returns(Promise.resolve(user));
			userService.getUserInfo()
				.subscribe(
					(resp) => {
						expect(resp).to.deep.equal(user);
						done();
					},
					() => {
						done('error');
					}
				);
		});

		it('should return empty object / user info not defined', (done) => {
			sandbox.stub(AuthService.prototype, 'getUser').returns(Promise.resolve(null));
			userService.getUserInfo()
				.subscribe(
					(resp) => {
						expect(resp).to.deep.equal({});
						done();
					},
					() => {
						done('error');
					}
				);
		});

		it('should failed / getUser method failed', (done) => {
			sandbox.stub(AuthService.prototype, 'getUser').returns(Promise.reject());
			userService.getUserInfo()
				.subscribe(
					() => {
						done('error');
					},
					() => {
						done();
					}
				);
		});
	});

	describe('getUserPermissions()', () => {
		it('should return permissions', () => {
			const groups = [Permission.getValuesByPermission(Permission.GALAXY_ADMIN).groupName];
			sandbox.stub(UserServiceMock.prototype, 'composeADGroups').returns(groups);
			const result = userService.getUserPermissions();
			expect(result).to.deep.equal([Permission.GALAXY_ADMIN]);
		});

		it('should return empty permissions', () => {
			sandbox.stub(UserServiceMock.prototype, 'composeADGroups').returns([]);
			const result = userService.getUserPermissions();
			expect(result).to.deep.equal([]);
		});
	});

	describe('composeUserInfo()', () => {
		it('should return user info / userInfo with redundant ADGroups items', () => {
			const groups = [Permission.getValuesByPermission(Permission.GALAXY_ADMIN).groupName];
			const userInfo = {
				sub: '00ufgargot0U1cUP00h7',
				ADGroups: [...groups, 'AWS DevOps Engineering RO', 'AWS DevOps Engineering Deployment']
			} as UserClaims;
			const userInfoResult = {
				sub: '00ufgargot0U1cUP00h7',
				ADGroups: groups
			} as UserClaims;

			sandbox.stub(UserServiceMock.prototype, 'composeADGroups').returns(groups);
			const result = userService.composeUserInfo(userInfo);
			expect(result).to.deep.equal(userInfoResult);
		});

		it('should return user info with empty ADGroups array [] / userInfo without ADGroups', () => {
			sandbox.stub(UserServiceMock.prototype, 'composeADGroups').returns([]);
			const userInfo = {
				sub: '00ufgargot0U1cUP00h7'
			} as UserClaims;
			const result = userService.composeUserInfo(userInfo);
			expect(result).to.deep.equal({sub: '00ufgargot0U1cUP00h7', ADGroups: []});
		});

		it('should return empty user info/ userInfo is empty object', () => {
			const userInfo = {} as UserClaims;
			const result = userService.composeUserInfo(userInfo);
			expect(result).to.deep.equal({});
		});

		it('should return empty object user info / userInfo is null', () => {
			const userInfo = null;
			const result = userService.composeUserInfo(userInfo);
			expect(result).to.deep.equal({});
		});

		it('should return empty object user info / userInfo is undefined', () => {
			const userInfo = undefined;
			const result = userService.composeUserInfo(userInfo);
			expect(result).to.deep.equal({});
		});
	});

	describe('composeADGroups()', () => {
		it('should return ADGroups / userInfo is defined', () => {
			const groups = [Permission.getValuesByPermission(Permission.GALAXY_SUPERUSER).groupName];
			const userInfo = {
				sub: '00ufgargot0U1cUP00h7',
				ADGroups: groups
			} as UserClaims;
			const result = userService.composeADGroups(userInfo);
			expect(result).to.deep.equal(groups);
		});

		it('should return empty [] / userInfo is null', () => {
			const userInfo = null;
			const result = userService.composeADGroups(userInfo);
			expect(result).to.deep.equal([]);
		});

		it('should return empty [] / userInfo is number', () => {
			const userInfo: any = 34343232;
			const result = userService.composeADGroups(userInfo);
			expect(result).to.deep.equal([]);
		});

		it('should return empty [] / userInfo is undefined', () => {
			const userInfo: any = undefined;
			const result = userService.composeADGroups(userInfo);
			expect(result).to.deep.equal([]);
		});

		it('should return empty [] / userInfo is string', () => {
			const userInfo: any = 'test-test';
			const result = userService.composeADGroups(userInfo);
			expect(result).to.deep.equal([]);
		});
	});
});