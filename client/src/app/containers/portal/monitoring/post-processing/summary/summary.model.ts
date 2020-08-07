import { RedshiftTablesSummaryDto } from '@rest/redshift/tables-summary';
import { QueryParamsType } from '@rest/shared/query-params.type';

export class MonitoringPostProcessingSummaryModel extends RedshiftTablesSummaryDto {
	navigateTo: string[];
	queryParams: QueryParamsType;

	constructor(data?: MonitoringPostProcessingSummaryModel) {
		super(data);

		if(!data) {
			return;
		}

		this.navigateTo = data.navigateTo;
		this.queryParams = data.queryParams;
	}
}
