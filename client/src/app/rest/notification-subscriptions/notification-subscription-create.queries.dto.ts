export class NotificationSubscriptionCreateQueriesDto {
	email: string;
	sourceApplication: string;
	creatorEmail: string;
	eventId: string;
	level: string;
	component: string;
	exception: boolean;

	constructor(data?: NotificationSubscriptionCreateQueriesDto) {
		if(!data) {
			return;
		}

		this.email = data.email;
		this.sourceApplication = data.sourceApplication;
		this.creatorEmail = data.creatorEmail;
		this.eventId = data.eventId;
		this.level = data.level;
		this.component = data.component;
		this.exception = data.exception;
	}
}
