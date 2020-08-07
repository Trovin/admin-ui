import { RouterStateParamsModel } from '@containers/shared/router-state.params.service';
import { DateRangeType } from '@enums/date-range-type.enum';
import { DateRangeColumnType } from '@enums/date-range-column-type.enum';

export class RedshiftEmptyRecordsRouterStateParamsModel extends RouterStateParamsModel {
	showIgnore?: boolean;
	dateRange?: DateRangeType;
	dateFrom?: string;
	dateTo?: string;
	dateRangeColumnType?: DateRangeColumnType;

	constructor(data: RedshiftEmptyRecordsRouterStateParamsModel) {
		super(data);

		if(!data) {
			return;
		}

		this.showIgnore = this.showIgnore = typeof data.showIgnore === 'string' ? data.showIgnore === 'true' : data.showIgnore; // @TODO: temporary solution for route.queries;
		this.dateRange = data.dateRange;
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
		this.dateRangeColumnType = data.dateRangeColumnType;
	}
}
