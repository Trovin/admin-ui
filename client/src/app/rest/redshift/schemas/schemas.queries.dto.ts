import { RedshiftSchemaType } from '@enums/redshift-schema-type.enum';

export class RedshiftSchemaQueriesDto {
	schemaType: RedshiftSchemaType;

	constructor(data?: RedshiftSchemaQueriesDto) {
		if(!data) {
			return;
		}

		this.schemaType = data.schemaType;
	}
}
