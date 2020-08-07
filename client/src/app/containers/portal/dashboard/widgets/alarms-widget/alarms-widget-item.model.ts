import { AlarmConfigDto } from '@rest/alarm-config';
import { QueryParamsType } from '@rest/shared/query-params.type';

export class AlarmWidgetItemModel extends AlarmConfigDto {
	sourceName?: string;
	eventTypeName?: string;
	activator?: string;
	lastCheck?: string;
	queryParams?: QueryParamsType;

	constructor(data?: AlarmWidgetItemModel) {
		super(data);

		if(!data) {
			return;
		}

		this.sourceName = data.sourceName;
		this.eventTypeName = data.eventTypeName;
		this.activator = data.activator;
		this.lastCheck = data.lastCheck;
		this.queryParams = data.queryParams;
	}
}
