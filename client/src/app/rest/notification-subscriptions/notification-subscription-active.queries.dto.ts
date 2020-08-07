export class NotificationSubscriptionActiveQueriesDto {
	active: boolean;

	constructor(data?: NotificationSubscriptionActiveQueriesDto) {
		if(!data) {
			return;
		}

		this.active = data.active;
	}
}
