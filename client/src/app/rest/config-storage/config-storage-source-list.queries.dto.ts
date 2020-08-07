interface ISourceListQuery {
	schemaName: string;
	tableName: string;
}

export class ConfigStorageSourceListQueriesDto {
	body: ISourceListQuery[];

	constructor(data?: ConfigStorageSourceListQueriesDto) {
		if(!data) {
			return;
		}

		this.body = data.body;
	}
}
