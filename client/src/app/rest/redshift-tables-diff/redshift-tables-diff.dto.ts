export class RedshiftTablesDiffTableDataDto {
	name: string;
	hasDifferences: boolean;
	presentOnProduction: boolean;
	presentOnIntegration: boolean;

	constructor(data: RedshiftTablesDiffTableDataDto) {
		if(!data) {
			return;
		}

		this.name = data.name;
		this.hasDifferences = data.hasDifferences;
		this.presentOnProduction = data.presentOnProduction;
		this.presentOnIntegration = data.presentOnIntegration;
	}
}

export class RedshiftTablesDiffDto {
	schemaName: string;
	hasDifferences: boolean;
	tables: RedshiftTablesDiffTableDataDto[];

	constructor(data: RedshiftTablesDiffDto) {
		if(!data) {
			return;
		}

		this.schemaName = data.schemaName;
		this.hasDifferences = data.hasDifferences;
		this.tables = data.tables.map(e => new RedshiftTablesDiffTableDataDto(e));
	}
}