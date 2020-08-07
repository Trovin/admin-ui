import { RedshiftSchemaType } from '@enums/redshift-schema-type.enum';
import { DateRangeType } from '@enums/date-range-type.enum';

export class RedshiftTablesQueriesDto {
	schemaType: RedshiftSchemaType;
	schema: string;
	table: string;
	page: number;
	dateFrom?: string;
	dateTo?: string;
	dateRangeColumn?: string;


	constructor(data?: RedshiftTablesQueriesDto) {
		if(!data) {
			return;
		}

		this.schemaType = data.schemaType;
		this.schema = data.schema;
		this.table = data.table;
		this.page = data.page;
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
		this.dateRangeColumn = data.dateRangeColumn;
	}
}
