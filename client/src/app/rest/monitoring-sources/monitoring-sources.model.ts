import { MonitoringSourcesDto } from './monitoring-sources.dto';
import { QueryParamsType } from '@rest/shared/query-params.type';

export class MonitoringSourcesModel extends MonitoringSourcesDto {
	navigateTo: string[];
	queryParams: QueryParamsType;

	constructor(data?: MonitoringSourcesModel) {
		super(data);

		if(!data) {
			return;
		}

		this.navigateTo = data.navigateTo;
		this.queryParams = data.queryParams;
	}
}
