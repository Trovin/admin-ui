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
