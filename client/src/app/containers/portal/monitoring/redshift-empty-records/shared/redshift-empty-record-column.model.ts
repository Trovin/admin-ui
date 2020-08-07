import { RedshiftEmptyRecordColumnDto } from '@rest/redshift-empty-records';

export class RedshiftEmptyRecordColumnModel extends RedshiftEmptyRecordColumnDto {
	ignoreLoading?: boolean;

	constructor(data: RedshiftEmptyRecordColumnModel) {
		super(data);

		if(!data) {
			return;
		}

		this.ignoreLoading = data.ignoreLoading;
	}
}
