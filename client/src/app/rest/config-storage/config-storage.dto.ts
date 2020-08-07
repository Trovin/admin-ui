interface ConfigParams {
	tableColumn: string;
	defaultValue: string;
	pattern: string;
	jsonPath: string;
	explodeAlias: string;
	type: string;
	thousandsSeparator: string;
}

export class Config {
	schemaName: string;
	tgTableName: string;

	metaColumns: ConfigParams[];
	pkColumns: ConfigParams[];
	orderColumns?: ConfigParams[];

	constructor(data?: Config) {
		if(!data) {
			return;
		}

		this.schemaName = data.schemaName;
		this.tgTableName = data.tgTableName;

		this.metaColumns = data.metaColumns;
		this.pkColumns = data.pkColumns;
		this.orderColumns = data.orderColumns;

	}
}
