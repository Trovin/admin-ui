export class NotificationSubscriptionComponentDto {
	name: string;
	description: string;
	alias: string;

	constructor(data?: NotificationSubscriptionComponentDto) {
		if(!data) {
			return;
		}

		this.name = data.name;
		this.description = data.description;
		this.alias = data.alias;
	}
}
