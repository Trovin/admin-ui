export class RedshiftEmptyRecordDto {
	ignoreNull: number;
	location: string;
	emptyCount: number;
	nullRecordsAllColumnsCount: number;
	nullColumnsCount: number;
	fromDate: Date;
	toDate: Date;

	constructor(data: RedshiftEmptyRecordDto) {
		if(!data) {
			return;
		}

		this.ignoreNull = data.ignoreNull;
		this.location = data.location;
		this.emptyCount = data.emptyCount;
		this.nullRecordsAllColumnsCount = data.nullRecordsAllColumnsCount;
		this.nullColumnsCount = data.nullColumnsCount;
		this.fromDate = data.fromDate;
		this.toDate = data.toDate;
	}
}