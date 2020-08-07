import { Router } from '@angular/router';

import { OktaAuthService } from '@okta/okta-angular';

import { Subject, Observable, BehaviorSubject, Subscription } from 'rxjs';

import * as sinon from 'sinon';
import { expect, assert } from 'chai';

import { oktaConfig } from '@core/auth/okta/okta.config';

import { AuthService, DefaultPermissions } from './auth.service';

class OktaAuthMock {
	token: any;

	constructor() {
		this.token = {
			getWithRedirect: () => {}
		};
	}
}

class AuthServiceMock extends AuthService {
	isAuthenticatedSubj = new BehaviorSubject<boolean>(false);
	oktaAuth: OktaAuthMock;
}

describe('AuthService', () => {
	const sandbox = sinon.createSandbox();

	let routerStub = null;
	let auth: AuthServiceMock;
	let oktaAuthService: OktaAuthService;

	beforeEach((() => {
		routerStub = sandbox.createStubInstance(Router);
		oktaAuthService = new OktaAuthService(oktaConfig, routerStub);
		auth = new AuthServiceMock(oktaAuthService);
		auth.oktaAuth = new OktaAuthMock();
	}));

	afterEach(() => {
		auth = null;
		sandbox.restore();
	});

	describe('logout()', () => {
		it('logout / success', (done) => {
			sandbox.stub(OktaAuthService.prototype, 'logout').returns(Promise.resolve());
			const sub = auth.logout()
				.subscribe(
					() => {
						sub.unsubscribe();
						done();
					},
					() => {
						sub.unsubscribe();
						done('error');
					}
				);
		});

		it('logout / fail', (done) => {
			sandbox.stub(OktaAuthService.prototype, 'logout').returns(Promise.reject());
			const sub = auth.logout()
				.subscribe(
					() => {
						sub.unsubscribe();
						done('error');
					},
					() => {
						sub.unsubscribe();
						done();
					}
				);
		});
	});

	describe('login()', () => {
		it('login / success', () => {
			const spy = sinon.spy(auth.oktaAuth.token, 'getWithRedirect');
			auth.login();
			sinon.assert.calledOnce(spy);
		});

		it('login / failed', () => {
			const spy = sinon.spy(auth.oktaAuth.token, 'getWithRedirect');
			auth.login();
			sinon.assert.calledOnce(spy);
		});
	});

	describe('isAuthenticated()', () => {
		it('isAuthenticated / success / true', (done) => {
			sandbox.stub(OktaAuthService.prototype, 'isAuthenticated').returns(Promise.resolve(true));
			const sub = auth.isAuthenticated()
				.subscribe(
					(status) => {
						sub.unsubscribe();
						expect(status).to.equal(true);
						done();
					},
					() => {
						sub.unsubscribe();
						done('error');
					}
				);
		});

		it('isAuthenticated / success / false', (done) => {
			sandbox.stub(OktaAuthService.prototype, 'isAuthenticated').returns(Promise.resolve(false));
			const sub = auth.isAuthenticated()
				.subscribe(
					(status) => {
						sub.unsubscribe();
						expect(status).to.equal(false);
						done();
					},
					() => {
						sub.unsubscribe();
						done('error');
					}
				);
		});

		it('isAuthenticated / failed', (done) => {
			sandbox.stub(OktaAuthService.prototype, 'isAuthenticated').returns(Promise.reject());
			const sub = auth.isAuthenticated()
				.subscribe(
					() => {
						sub.unsubscribe();
						done('error');
					},
					(e) => {
						sub.unsubscribe();
						expect(e).to.equal(false);
						done();
					}
				);
		});
	});

	describe('handleAuthentication()', () => {
		it('handleAuthentication / success / true', (done) => {
			sandbox.stub(OktaAuthService.prototype, 'handleAuthentication').returns(Promise.resolve());
			const sub = auth.handleAuthentication()
				.subscribe(
					(status) => {
						sub.unsubscribe();
						expect(status).to.equal(true);
						done();
					},
					() => {
						sub.unsubscribe();
						done('error');
					}
				);
		});

		it('handleAuthentication / failed', (done) => {
			sandbox.stub(OktaAuthService.prototype, 'handleAuthentication').returns(Promise.reject('Error'));
			const sub = auth.handleAuthentication()
				.subscribe(
					() => {
						sub.unsubscribe();
						done('error');
					},
					(e) => {
						sub.unsubscribe();
						expect(e).to.equal('Error');
						done();
					}
				);
		});
	});

	describe('authenticationState()', () => {
		it('authenticationState / success / true', (done) => {
			oktaAuthService.$authenticationState = Observable.create((observer: Subject<boolean>) => {
				setTimeout(() => {
					observer.next(true);
					observer.complete();
				});
			});
			const sub = auth.authenticationState()
				.subscribe(
					(status) => {
						sub.unsubscribe();
						expect(status).to.equal(true);
						done();
					},
					() => {
						sub.unsubscribe();
						done('error');
					}
				);
		});

		it('authenticationState / success / false', (done) => {
			oktaAuthService.$authenticationState = Observable.create((observer: Subject<boolean>) => {
				setTimeout(() => {
					observer.next(false);
					observer.complete();
				});
			});
			const sub = auth.authenticationState()
				.subscribe(
					(status) => {
						sub.unsubscribe();
						expect(status).to.equal(false);
						done();
					},
					() => {
						sub.unsubscribe();
						done('error');
					}
				);
		});

		it('authenticationState / failed', (done) => {
			oktaAuthService.$authenticationState = Observable.create((observer: Subject<boolean>) => {
				setTimeout(() => {
					observer.error(true);
				});
			});
			const sub = auth.authenticationState()
				.subscribe(
					() => {
						sub.unsubscribe();
						done('error');
					},
					(e) => {
						sub.unsubscribe();
						expect(e).to.equal(false);
						done();
					}
				);
		});
	});

	describe('getAccessToken()', () => {
		it('getAccessToken / success / true', (done) => {
			const token = 'eyJraWQiOiJTcDdCREdFRkFaTkFmZW1KTVRza1ZwME00U2hFQW5HYVRFai1tcFZXdXVzIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULnB6cFdBeEFJM3RHa29zVnpNamZmTWVnYjN4OW9BSGlWNTN3Z1poOERzUnciLCJpc3MiOiJodHRwczovL2JobmV0d29ya3BwLm9rdGFwcmV2aWV3LmNvbS9vYXV0aDIvZGVmYXVsdCIsImF1ZCI6ImFwaTovL2RlZmF1bHQiLCJpYXQiOjE1NjA0MzEyMTgsImV4cCI6MTU2MDQzNDgxOCwiY2lkIjoiMG9hZm85d3pzZ1B2bkl5VzUwaDciLCJ1aWQiOiIwMHVmZ2FyZ290MFUxY1VQMDBoNyIsInNjcCI6WyJhZGRyZXNzIiwicHJvZmlsZSIsIm9wZW5pZCIsInBob25lIiwiZW1haWwiXSwic3ViIjoiYWtoYXIwMS1wcEBQUkVQUk9ELkxPQ0FMIn0.biqTi4jbYJUnj6l8tOsK1iDB4rsYXGvvAsy0-y1CNF6Z4zwmuMnmYg8c2ED6z_tDOq9DtnCrw6_v8bhQNH90RrjEXryaUXy_htIO2mdjFRnW2mB5PcVPLWHfLlM2nGRdSAEh5XCKPOPyDfE8LtI16YvdpqTEYvvxIXg_A1SRDthMm65S4gyzXDo_PLlEgW6MM5DAYjpA-2Alr76rnlApX-dRIHUZ3kOzOK7QUBORK726ZMX-2DFT-M6aWfSbtIQkobcRIOZCBZ50rUDG2AmR7HbVr1_3BceJsne2kU5k9_JQuK_hENX_Fv8mRA5T3GqbVr1yIdE5qtm2Lhm_IJSNdg';
			sandbox.stub(OktaAuthService.prototype, 'getAccessToken').returns(Promise.resolve(token));
			const sub = auth.getAccessToken()
				.subscribe(
					(resp) => {
						sub.unsubscribe();
						expect(resp).to.equal(token);
						done();
					},
					() => {
						sub.unsubscribe();
						done('error');
					}
				);
		});

		it('getAccessToken / failed', (done) => {
			sandbox.stub(OktaAuthService.prototype, 'getAccessToken').returns(Promise.reject(null));
			const sub = auth.getAccessToken()
				.subscribe(
					() => {
						sub.unsubscribe();
						done('error');
					},
					(e) => {
						sub.unsubscribe();
						expect(e).to.equal(null);
						done();
					}
				);
		});
	});

	describe('setAuthenticationSubj()', () => {
		it('should set user info to userInfo property and to userInfoSubj', () => {
			auth.setAuthenticationSubj(true);
			auth.isAuthenticatedSubj.value.should.eql(true);
		});
	});

	describe('getUser()', () => {
		it('should return user info Promise', (done) => {
			const spy = sinon.spy(OktaAuthService.prototype, 'getUser');

			auth.getUser()
				.then(() => {
					assert(spy.calledOnce);
					done();
				})
				.catch(() => done('error'));
		});
	});

	describe('getPermission()', () => {
		it('should return the DefaultPermissions obj if the token does not contain any permissions', (done) => {
			const token = 'eyJraWQiOiJTcDdCREdFRkFaTkFmZW1KTVRza1ZwME00U2hFQW5HYVRFai1tcFZXdXVzIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULnB6cFdBeEFJM3RHa29zVnpNamZmTWVnYjN4OW9BSGlWNTN3Z1poOERzUnciLCJpc3MiOiJodHRwczovL2JobmV0d29ya3BwLm9rdGFwcmV2aWV3LmNvbS9vYXV0aDIvZGVmYXVsdCIsImF1ZCI6ImFwaTovL2RlZmF1bHQiLCJpYXQiOjE1NjA0MzEyMTgsImV4cCI6MTU2MDQzNDgxOCwiY2lkIjoiMG9hZm85d3pzZ1B2bkl5VzUwaDciLCJ1aWQiOiIwMHVmZ2FyZ290MFUxY1VQMDBoNyIsInNjcCI6WyJhZGRyZXNzIiwicHJvZmlsZSIsIm9wZW5pZCIsInBob25lIiwiZW1haWwiXSwic3ViIjoiYWtoYXIwMS1wcEBQUkVQUk9ELkxPQ0FMIn0.biqTi4jbYJUnj6l8tOsK1iDB4rsYXGvvAsy0-y1CNF6Z4zwmuMnmYg8c2ED6z_tDOq9DtnCrw6_v8bhQNH90RrjEXryaUXy_htIO2mdjFRnW2mB5PcVPLWHfLlM2nGRdSAEh5XCKPOPyDfE8LtI16YvdpqTEYvvxIXg_A1SRDthMm65S4gyzXDo_PLlEgW6MM5DAYjpA-2Alr76rnlApX-dRIHUZ3kOzOK7QUBORK726ZMX-2DFT-M6aWfSbtIQkobcRIOZCBZ50rUDG2AmR7HbVr1_3BceJsne2kU5k9_JQuK_hENX_Fv8mRA5T3GqbVr1yIdE5qtm2Lhm_IJSNdg';
			sandbox.stub(OktaAuthService.prototype, 'getIdToken').returns(Promise.resolve(token));

			const sub = auth.getPermission()
				.subscribe( resp => {
					sub.unsubscribe();
					expect(resp).to.equal(DefaultPermissions);
					done();
				});
		});

		it('should return valid permissions', (done) => {
			const token = 'eyJraWQiOiJWSGt3ZTIyZmxvVmVGQl9ydlg0aHYtSmVWLTh0OTJaQXZxbW9tc1dRdFRNIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiIwMHVvMHQ2bHZvaTJSMVUxQjBoNyIsIm5hbWUiOiJBbGV4IE1vcm96IiwiZW1haWwiOiJhbW9ybzAwLXBwQFBSRVBST0QuTE9DQUwiLCJ2ZXIiOjEsImlzcyI6Imh0dHBzOi8vZGV2LTYwOTEyOS5va3RhcHJldmlldy5jb20vb2F1dGgyL2F1c2w0bGNtNWZLWWlkZEhLMGg3IiwiYXVkIjoiMG9hZGJ3cXJ1ZWNyd0V4SHMwaDciLCJpYXQiOjE1NzkyNTk0MTcsImV4cCI6MTU3OTI2MzAxNywianRpIjoiSUQuOHVIbko3ZHZhN2o4Q0ExVm5rU1kyOFhCZ05uMHl5cldxeHA1TWpnTURCYyIsImFtciI6WyJwd2QiXSwiaWRwIjoiMDBvZGJ6cDIyOFJSSjl3eFUwaDciLCJub25jZSI6ImhESTVEQzNPNnBkRllNM0FKYkJvc2k1QWJmSG4xVnVHNm9kdzdMcUVDMHl5d3JmMG5sb3ZnbncxdDhseE1FbmciLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhbW9ybzAwLXBwQFBSRVBST0QuTE9DQUwiLCJhdXRoX3RpbWUiOjE1NzkyNTk0MTYsImF0X2hhc2giOiJyZzlUV19kTmIyZENpdWR3bnoyVVFBIiwidGVzdF9kYXRhIjoiMDAwMCIsInBlcm1pc3Npb25zX3BvbGljeSI6eyJzdGF0ZW1lbnQiOlt7ImVmdCI6ImRlbnkiLCJhY3QiOlsidXBkYXRlIiwiZGVsZXRlIl0sIm9iaiI6WyJzdWJzY3JpcHRpb25zIl19LHsiZWZ0IjoiZGVueSIsImFjdCI6WyJjcmVhdGUiLCJ2aWV3Il0sIm9iaiI6WyJwaXBlbGluZXNjb25maWdzIl19LHsiZWZ0IjoiYWxsb3ciLCJhY3QiOlsiY3JlYXRlIl0sIm9iaiI6WyJzM2FsYXJtc2NvbmZpZ3MiXX0seyJlZnQiOiJhbGxvdyIsImFjdCI6WyJ2aWV3Il0sIm9iaiI6WyJzdWJzY3JpcHRpb25zIiwiZGF0YW1hcnRzZW1wdHlyZWNvcmRzIiwidW5rbm93bmZpZWxkcyIsInMzYWxhcm1zY29uZmlncyIsInBpcGVsaW5lcyIsInNvdXJjZWNhdGFsb2ciXX0seyJlZnQiOiJhbGxvdyIsImFjdCI6WyJ1cGRhdGUiXSwib2JqIjpbInBpcGVsaW5lcyJdfV19LCJncm91cHMiOlsiRXZlcnlvbmUiXX0.YURM_AOkK1e-hokG_Nn1DVwCti2hHjHOoKMlSH5ibgnRBjmM_hMSxVbW259O1XjF2C_l-EMbC4F642AyQkVd4QkyZSWvC2Yd1MC1HCyY4xwLoCP_NGpG9lYGRxBwT70pEX-pGI61PRz4jGDgiDmpbwMoFu6FEJJzXbmHagR9TGb6t5np-vksqY7Gn6eUs4a5sYfv-dsvQ8bV3jIMW5t0Oo4YhJwvX2qZKT8eFvJNlFgp4N4NItWOpYkD4CjdydQl3Fvi6GXhiQ2lb5RvvJtsdLHu7TS-9iVlOuI2jEQOB-uvSwbKSWZmCXAOOJlVP9M3fmBBueU2kWOg6xaRBEzbYA';
			const mock = {
				eft: 'deny',
				act: ['update', 'delete'],
				obj: ['subscriptions']
			};

			sandbox.stub(OktaAuthService.prototype, 'getIdToken').returns(Promise.resolve(token));

			const sub = auth.getPermission()
				.subscribe( resp => {
					sub.unsubscribe();
					expect(resp[0].obj).is.members(mock.obj);
					expect(resp[0].act).is.members(mock.act);
					expect(resp[0].eft).is.equal(mock.eft);
					done();
				});
		});
	});

	describe('getAuthenticationSubj()', () => {
		const subj = new Subscription();

		afterEach(() => {
			subj.unsubscribe();
		});

		it('should return default authentication status', (done) => {
			const sub = auth.getAuthenticationSubj()
				.subscribe((status) => {
					expect(status).to.be.equal(false);
					done();
				});

			subj.add(sub);
		});

		it('should return authentication status', (done) => {
			auth.setAuthenticationSubj(true);
			const sub = auth.getAuthenticationSubj()
				.subscribe((status) => {
					expect(status).to.be.equal(true);
					done();
				});

			subj.add(sub);
		});
	});
});
