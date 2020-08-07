import { Config } from './index';

export class ConfigStorageItemDto {
	sourceApplication: string;
	eventId: string;
	metadataList?: Config[];
	matillionMessageBody: string;
	explode: boolean;

	constructor(data?: ConfigStorageItemDto) {
		if(!data) {
			return;
		}

		this.eventId = data.eventId;
		this.sourceApplication = data.sourceApplication;
		this.metadataList = data.metadataList;
		this.matillionMessageBody = data.matillionMessageBody;
		this.explode = data.explode;
	}
}
