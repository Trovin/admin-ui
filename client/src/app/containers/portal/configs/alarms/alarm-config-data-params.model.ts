import { AlarmStatuses } from '@enums/alarm-statuses.enum';

export class AlarmDataParamsModel {
	page?: number;
	bucket?: string;
	sourcePrefix?: string;
	status?: AlarmStatuses;
	enabledOnly?: boolean;

	constructor(data?: AlarmDataParamsModel) {
		if(!data) {
			return;
		}

		this.bucket = data.bucket;
		this.sourcePrefix = data.sourcePrefix;
		this.page = data.page;
		this.status = AlarmStatuses[data.status];
		this.enabledOnly = typeof data.enabledOnly === 'string' ? data.enabledOnly === 'true' : data.enabledOnly; // @TODO: temporary solution for route.queries
	}
}
