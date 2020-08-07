export class RedshiftDataTableQueriesDto {
	schemaName: string;
	tableName: string;
	limit?: number;
	orderBy?: string;
	orderByType?: string;

	constructor(data?: RedshiftDataTableQueriesDto) {
		if(!data) {
			return;
		}

		this.schemaName = data.schemaName;
		this.tableName = data.tableName;
		this.limit = data.limit;
		this.orderBy = data.orderBy;
		this.orderByType = data.orderByType;
	}
}
