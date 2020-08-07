import { RouterStateParamsModel } from '@containers/shared/router-state.params.service';

export class BaseParamsModel extends RouterStateParamsModel {
	sourceApplication?: string;
	eventId?: string;
	schemaName?: string;
	tableName?: string;

	constructor(data?: BaseParamsModel) {
		super(data);

		if(!data) {
			return;
		}

		this.sourceApplication = data.sourceApplication;
		this.eventId = data.eventId;
		this.schemaName = data.schemaName;
		this.tableName = data.tableName;
	}
}
