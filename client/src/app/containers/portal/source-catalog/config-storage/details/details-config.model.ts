export interface ConfigParams {
	tableColumn: string;
	defaultValue: string;
	pattern: string;
	jsonPath: string;
	explodeAlias: string;
	type: string;
	thousandsSeparator: string;

	isPrimaryKey?: boolean;
	isModifiedDate?: boolean;
}

export class DetailConfigModel {
	schemaName: string;
	tableName: string;

	columns: ConfigParams[];
	primaryKeys: ConfigParams[];
	orderColumns?: ConfigParams[];

	constructor(data?: DetailConfigModel) {
		if(!data) {
			return;
		}

		this.schemaName = data.schemaName;
		this.tableName = data.tableName;

		this.columns = data.columns;
		this.primaryKeys = data.primaryKeys;
		this.orderColumns = data.orderColumns;
	}
}
