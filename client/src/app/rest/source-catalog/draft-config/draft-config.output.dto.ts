export class DraftConfig {
	sourceApplication: string;
	eventType: string;
	schemaName: string;
	tableName: string;
	parentEntityName?: string;

	constructor(data?: DraftConfig) {
		if(!data) {
			return;
		}

		this.sourceApplication = data.sourceApplication;
		this.eventType = data.eventType;
		this.schemaName = data.schemaName;
		this.tableName = data.tableName;
		this.parentEntityName = data.parentEntityName;
	}
}
