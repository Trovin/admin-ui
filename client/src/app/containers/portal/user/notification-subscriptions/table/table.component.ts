import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Containers } from '@config/containers.enum';

import { PaginationService } from '@shared/pagination.service';
import { PermissionAction } from '@enums/permission-actions.enum';

import { ModalsService } from '@containers/portal/user/notification-subscriptions/modal/modals.service';
import { NotificationSubscriptionsService } from '@rest/notification-subscriptions';
import { NotificationSubscriptionModel } from '@containers/portal/user/notification-subscriptions/notification-subscription.model';

@Component({
	selector: 'subscriptions-table',
	templateUrl: './table.html',
	providers: [
		NotificationSubscriptionsService,
		PaginationService,
		ModalsService
	]
})

export class TableComponent {

	@Input()
	hideSecondaryColumns: boolean;
	@Input()
	items: NotificationSubscriptionModel[];
	@Output()
	delete = new EventEmitter<NotificationSubscriptionModel>();
	@Output()
	switchSubscriptionState = new EventEmitter<NotificationSubscriptionModel>();

	permission = PermissionAction;
	containers = Containers;

	pagination = new PaginationService();
	loading = false;
	timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
}
