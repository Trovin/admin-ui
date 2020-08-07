import { Injectable } from '@angular/core';
import { UserClaims } from '@okta/okta-angular';

import { BehaviorSubject, Subject } from 'rxjs';

import { AuthService } from '@core/auth/auth.service';

import { Permission } from '@enums/permission.enum';

@Injectable()
export class UserService {
	protected userInfoSubj = new BehaviorSubject<UserClaims>({} as UserClaims);

	protected userInfo = {} as UserClaims;

	constructor(private auth: AuthService) {}

	setUserInfoDefaultSubj() {
		const userInfo = {} as UserClaims;
		this.setUserInfo(userInfo);
		this.userInfoSubj.next(userInfo);
	}

	setUserInfoSubj(info: UserClaims): void {
		const userInfo = this.composeUserInfo(info);
		this.setUserInfo(userInfo);
		this.userInfoSubj.next(userInfo);
	}

	getUserInfoSubj(): BehaviorSubject<UserClaims> {
		return this.userInfoSubj;
	}

	getUserInfo() {
		const subj = new Subject<UserClaims>();

		this.auth.getUser()
			.then((info) => {
				const userInfo = this.composeUserInfo(info);
				subj.next(userInfo);
				subj.complete();
			})
			.catch((e) => subj.error(e));

		return subj;
	}

	getUserPermissions() {
		const groups = this.composeADGroups(this.userInfo);
		return groups
			.filter((e: string) => !!Permission.getValuesByGroupName(e))
			.map((e: string) => Permission.getValuesByGroupName(e).permission);
	}

	protected setUserInfo(info: UserClaims) {
		this.userInfo = info;
	}

	protected composeUserInfo(info: UserClaims): UserClaims {
		if(info === null || typeof info !== 'object' || info.constructor.name !== 'Object') {
			return {} as UserClaims;
		}

		const userInfo = info;
		if(!!Object.keys(userInfo).length) {
			userInfo['ADGroups'] = this.composeADGroups(userInfo);
		}
		return userInfo;
	}

	protected composeADGroups(info: UserClaims): string[] {
		if(info === null || typeof info !== 'object' || info.constructor.name !== 'Object') {
			return [];
		}
		const userInfoADGroups = info['ADGroups'] || [];
		return userInfoADGroups
			.filter((e: string) => !!Permission.getValuesByGroupName(e))
			.map((e: string) => Permission.getValuesByGroupName(e).groupName);
	}
}
