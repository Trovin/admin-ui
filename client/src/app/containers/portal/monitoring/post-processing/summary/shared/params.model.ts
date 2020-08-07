import { DateRangeType } from '@enums/date-range-type.enum';
import { RedshiftSchemaType } from '@enums/redshift-schema-type.enum';

export class MonitoringPostProcessingSummaryParamsModel {
	schemaType: RedshiftSchemaType;
	dateRange?: DateRangeType;
	dateFrom?: string;
	dateTo?: string;

	constructor(data?: MonitoringPostProcessingSummaryParamsModel) {
		if(!data) {
			return;
		}
		this.schemaType = data.schemaType;
		this.dateRange = DateRangeType[data.dateRange];
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
	}
}
