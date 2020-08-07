export class BatchDataSourceApplicationDto {
	sourceApplications: string[];

	constructor(data?: BatchDataSourceApplicationDto) {
		if(!data) {
			return;
		}

		this.sourceApplications = data.sourceApplications;
	}
}
