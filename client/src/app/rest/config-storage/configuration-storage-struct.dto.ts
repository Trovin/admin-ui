export class ConfigStorageStructureDto {
	schemaName: string;
	tableList: string[];

	constructor(data?: ConfigStorageStructureDto) {
		if(!data) {
			return;
		}

		this.schemaName = data.schemaName;
		this.tableList = data.tableList;
	}
}
