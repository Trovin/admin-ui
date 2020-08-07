import { Component, OnInit, OnDestroy } from '@angular/core';

import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { UserService } from '@core/user/user.service';

import { PermissionAction } from '@enums/permission-actions.enum';
import { Containers } from '@config/containers.enum';

import { alertsService } from '@components/ui';

import { PaginationService } from '@containers/shared/pagination.service';

import {
	NotificationSubscriptionsService,
	NotificationSubscriptionActiveQueriesDto,
} from '@rest/notification-subscriptions';

import { ModalsService } from './modal/modals.service';

import { NotificationSubscriptionModel } from './notification-subscription.model';

@Component({
	selector: 'notification-subscriptions',
	templateUrl: './notification-subscriptions.html',
	providers: [
		NotificationSubscriptionsService,
		PaginationService,
		ModalsService
	]
})

export class NotificationSubscriptionsComponent implements OnInit, OnDestroy {
	private sub = new Subscription();

	subscriptions: NotificationSubscriptionModel[];
	exceptions: NotificationSubscriptionModel[];

	permission = PermissionAction;
	containers = Containers;

	userEmail = '';
	pagination = new PaginationService();
	loading = false;
	timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	constructor(
		private userService: UserService,
		private modalService: ModalsService,
		private service: NotificationSubscriptionsService
	) {}

	ngOnInit() {
		this.fetch();

		const sub = this.userService.getUserInfoSubj()
			.subscribe((info) => {
				this.userEmail = info.email;
			});

		this.sub.add(sub);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	fetch() {
		this.loading = true;

		this.service.getList()
			.pipe(
				map(resp => resp.map(e => new NotificationSubscriptionModel({
					...e,
					loading: false,
					deleteInProcess: false
				})))
			)
			.subscribe(
				(resp) => {
					this.subscriptions = resp.filter(subscription => !subscription.exception);
					this.exceptions = resp.filter(subscription => subscription.exception);
					this.loading = false;
				},
				() => {
					this.subscriptions = [];
					this.exceptions = [];
					this.loading = false;
				}
			);
	}

	switchSubscriptionState(item: NotificationSubscriptionModel) {
		item.loading = true;

		const active = !item.active;

		const queries = new NotificationSubscriptionActiveQueriesDto({
			active: active
		});

		this.service.switchState(item.uuid, queries)
			.subscribe(
				() => {
					item.active = active;
					item.loading = false;
				},
				() => {
					item.active = !active;
					item.loading = false;
				}
			);
	}

	delete(item: NotificationSubscriptionModel) {
		const msg = 'Do you want to confirm the deletion?';

		this.modalService.openConfirmModal(msg)
			.subscribe((status) => {
				if(status) {
					this.onDelete(item);
				}
			});
	}

	createOwnSubscription() {
		this.modalService.openCreateModal({
			userEmail: this.userEmail,
			creatorEmail: this.userEmail,
			title: 'Create Own Subscription'
		})
		.subscribe(() => this.fetch());
	}

	createOtherSubscription() {
		this.modalService.openCreateModal({
			userEmail: '',
			creatorEmail: this.userEmail,
			title: 'Create Other Subscription'
		})
		.subscribe(() => this.fetch());
	}

	private onDelete(item: NotificationSubscriptionModel) {
		item.deleteInProcess = true;
		this.service.delete(item.uuid)
			.subscribe(
				() => {
					this.fetch();
					alertsService.success('Successfully deleted');
					item.deleteInProcess = false;
				},
				() => item.deleteInProcess = false
			);
	}
}
