export class RedshiftTablesDiffTableDto {
	productionSchema: string;
	integrationSchema: string;

	constructor(data: RedshiftTablesDiffTableDto) {
		if(!data) {
			return;
		}

		this.productionSchema = data.productionSchema;
		this.integrationSchema = data.integrationSchema;
	}
}