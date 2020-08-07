export class SourceCatalogDto {
	sourceApplication: string;
	eventId: string;
	appliedDate: string;
	appliedUser: string;
	isReconActive?: boolean;
	isReconConfigExists: boolean;
	isBatch: boolean;
	bucketName: string;

	constructor(data?: SourceCatalogDto) {
		if(!data) {
			return;
		}

		this.sourceApplication = data.sourceApplication;
		this.eventId = data.eventId;
		this.appliedDate = data.appliedDate;
		this.appliedUser = data.appliedUser;
		this.isReconActive = data.isReconActive;
		this.isReconConfigExists = data.isReconConfigExists;
		this.isBatch = data.isBatch;
		this.bucketName = data.bucketName;
	}
}
