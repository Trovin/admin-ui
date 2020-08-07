import { RedshiftTablesDiffDto } from '@rest/redshift-tables-diff';

export class RedshiftTablesDiffModel extends RedshiftTablesDiffDto {
	opened?: boolean;

	constructor(data: RedshiftTablesDiffModel) {
		super(data);

		if(!data) {
			return;
		}

		this.opened = data.opened;
		this.tables = data.tables;
	}
}