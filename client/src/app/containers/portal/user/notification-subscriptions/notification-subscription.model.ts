import { NotificationSubscriptionDto } from '@rest/notification-subscriptions';

export class NotificationSubscriptionModel extends NotificationSubscriptionDto {
	loading: boolean;
	deleteInProcess: boolean;

	constructor(data?: NotificationSubscriptionModel) {
		super(data);

		if(!data) {
			return;
		}

		this.loading = data.loading;
		this.deleteInProcess = data.deleteInProcess;
	}
}