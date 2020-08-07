export class RedshiftViewerConfigDto {
	schema: string;
	tables: string[];

	constructor(data?: RedshiftViewerConfigDto) {
		if(!data) {
			return;
		}

		this.schema = data.schema;
		this.tables = data.tables;
	}
}
