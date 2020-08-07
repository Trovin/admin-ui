export class SourceCatalogSourceApplicationsDto {
	name: string;

	constructor(data?: SourceCatalogSourceApplicationsDto) {
		if(!data) {
			return;
		}

		this.name = data.name;
	}
}
