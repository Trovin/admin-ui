import { RedshiftTablesInfoDto } from './tables-info.dto';

export class RedshiftSchemaDto {
	name: string;
	tables: RedshiftTablesInfoDto[];

	constructor(data?: RedshiftSchemaDto) {
		if(!data) {
			return;
		}

		this.name = data.name;
		this.tables = data.tables;
	}
}
