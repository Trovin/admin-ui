export class RedshiftTablesSummaryDto {
	tableName: string;
	errorsCount: number;
	isDateColumnExist: boolean;

	constructor(data?: RedshiftTablesSummaryDto) {
		if(!data) {
			return;
		}

		this.tableName = data.tableName;
		this.errorsCount = data.errorsCount;
		this.isDateColumnExist = data.isDateColumnExist;
	}
}
