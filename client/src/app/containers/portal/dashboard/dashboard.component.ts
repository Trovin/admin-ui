import { OnInit, Component, ViewChild, OnDestroy } from '@angular/core';
import { AuthService } from '@core/auth';

import { PermissionAction } from '@enums/permission-actions.enum';
import { Containers } from '@config/containers.enum';

import { AlarmsWidgetComponent } from './widgets/alarms-widget/alarms-widget.component';
import { UserService } from '@core/user/user.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { filter } from 'rxjs/operators';
import { PermissionsService } from '@core/permissions/permissions.service';

@Component({
	selector: 'dashboard',
	templateUrl: './dashboard.html',
	styleUrls: ['./dashboard.scss']
})

export class DashboardComponent implements OnInit, OnDestroy {
	@ViewChild(AlarmsWidgetComponent, {static: true}) alarms: AlarmsWidgetComponent;

	permission = PermissionAction;
	containers = Containers;

	private hasView = false;

	userName: string;
	showContent = false;

	private sub = new Subscription();

	constructor(
		private authService: AuthService,
		private userService: UserService,
		private permissionsService: PermissionsService
	) {}

	ngOnInit(): void {
		this.sub = this.userService.getUserInfoSubj()
			.subscribe((info) => this.userName = info.name);

		this.checkDashboardContentPermit(this.containers.PIPELINES, [this.permission.VIEW]);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	fetchAlarmsList() {
		this.alarms.fetch();
	}

	private checkDashboardContentPermit(container: Containers, permissionList: PermissionAction[]) {
		this.permissionsService.getPermitSubj(container, permissionList)
			.pipe(
				filter(() => !this.hasView)
			)
			.subscribe(isAllowed => this.showContent = isAllowed);
	}
}
