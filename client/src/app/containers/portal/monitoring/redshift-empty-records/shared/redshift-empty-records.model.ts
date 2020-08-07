import { RedshiftEmptyRecordDto } from '@rest/redshift-empty-records';
import { RedshiftEmptyRecordColumnModel } from './redshift-empty-record-column.model';

export class RedshiftEmptyRecordsModel extends RedshiftEmptyRecordDto {
	columns?: RedshiftEmptyRecordColumnModel[];
	loading?: boolean;

	constructor(data: RedshiftEmptyRecordsModel) {
		super(data);

		if(!data) {
			return;
		}

		this.columns = data.columns;
		this.loading = data.loading;
	}
}
