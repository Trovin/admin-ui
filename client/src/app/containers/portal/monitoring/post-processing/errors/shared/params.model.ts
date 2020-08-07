import { DateRangeType } from '@enums/date-range-type.enum';
import { RedshiftSchemaType } from '@enums/redshift-schema-type.enum';

export class MonitoringPostProcessingErrorParamsModel {
	schemaType: RedshiftSchemaType;
	schema?: string;
	table?: string;
	dateRange?: DateRangeType;
	dateFrom?: string;
	dateTo?: string;
	dateRangeColumn?: string;
	page?: number;

	constructor(data?: MonitoringPostProcessingErrorParamsModel) {
		if(!data) {
			return;
		}
		this.schemaType = data.schemaType;
		this.schema = data.schema;
		this.table = data.table;
		this.dateRange = DateRangeType[data.dateRange];
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
		this.dateRangeColumn = data.dateRangeColumn;
		this.page = data.page;
	}
}
