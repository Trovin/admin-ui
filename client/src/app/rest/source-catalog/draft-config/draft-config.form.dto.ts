export class DraftConfigFormData {
	schemaName: string;
	tableName: string;
	parentEntityName?: string;

	constructor(data?: DraftConfigFormData) {
		if(!data) {
			return;
		}

		this.schemaName = data.schemaName;
		this.tableName = data.tableName;
		this.parentEntityName = data.parentEntityName;
	}
}
