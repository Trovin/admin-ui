export class MissingConfigDto {
	sourceApplication: string;
	eventId?: string;
	bucketName?: string;
	missingConfig?: string;

	constructor(data: MissingConfigDto) {
		if(!data) {
			return;
		}

		this.sourceApplication = data.sourceApplication;
		this.eventId = data.eventId;
		this.bucketName = data.bucketName;
		this.missingConfig = data.missingConfig;
	}
}
