import { RedshiftDataTableColumnModel } from './data-table-column.model';

export class RedshiftDataTableDto {
	rows: RedshiftDataTableColumnModel[];

	constructor(data?: RedshiftDataTableDto) {
		if(!data) {
			return;
		}

		this.rows = data.rows;
	}
}
