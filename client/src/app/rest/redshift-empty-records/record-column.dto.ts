export class RedshiftEmptyRecordColumnDto {
	location: string;
	columnName: string;
	emptyCount: string;
	nullRecordsAllColumnsCount: string;
	ignoreNull: boolean;
	fromDate: Date;
	toDate: Date;

	constructor(data: RedshiftEmptyRecordColumnDto) {
		if(!data) {
			return;
		}

		this.location = data.location;
		this.columnName = data.columnName;
		this.emptyCount = data.emptyCount;
		this.nullRecordsAllColumnsCount = data.nullRecordsAllColumnsCount;
		this.ignoreNull = data.ignoreNull;
		this.fromDate = data.fromDate;
		this.toDate = data.toDate;
	}
}