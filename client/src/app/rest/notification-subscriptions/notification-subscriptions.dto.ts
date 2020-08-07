export class NotificationSubscriptionDto {
	uuid: string;
	sourceApplication: string;
	eventId: string;
	level: string;
	component: string;
	email: string;
	creatorEmail: string;
	active: boolean;
	lastNotificationSentDate: Date;
	totalNotificationsSent: number;
	exception: boolean;

	constructor(data?: NotificationSubscriptionDto) {
		if(!data) {
			return;
		}

		this.uuid = data.uuid;
		this.sourceApplication = data.sourceApplication;
		this.eventId = data.eventId;
		this.level = data.level;
		this.component = data.component;
		this.email = data.email;
		this.creatorEmail = data.creatorEmail;
		this.active = data.active;
		this.lastNotificationSentDate = data.lastNotificationSentDate;
		this.totalNotificationsSent = data.totalNotificationsSent;
		this.exception = data.exception;
	}
}
