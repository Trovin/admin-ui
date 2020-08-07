export class RedshiftTablesInfoDto {
	name: string;
	columns: string[] = [];

	constructor(data?: RedshiftTablesInfoDto) {
		if(!data) {
			return;
		}

		this.name = data.name;
		this.columns = data.columns;
	}
}
