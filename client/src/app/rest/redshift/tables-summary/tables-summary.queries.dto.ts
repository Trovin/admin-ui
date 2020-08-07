import { RedshiftSchemaType } from '@enums/redshift-schema-type.enum';

export class RedshiftTablesSummaryQueriesDto {
	schemaType: RedshiftSchemaType;
	dateFrom?: string;
	dateTo?: string;

	constructor(data?: RedshiftTablesSummaryQueriesDto) {
		if(!data) {
			return;
		}

		this.schemaType = RedshiftSchemaType[data.schemaType];
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
	}
}
