export class CloudWatchAlarmDto {
	name: string;
	description: string;
	namespace: string;
	stateUpdateTimestamp: Date;
	url: string;

	constructor(data: CloudWatchAlarmDto) {
		if (!data) {
			return;
		}

		this.name = data.name;
		this.description = data.description;
		this.namespace = data.namespace;
		this.stateUpdateTimestamp = data.stateUpdateTimestamp;
		this.url = data.url;
	}
}
