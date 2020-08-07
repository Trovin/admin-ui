import { DateRangeType } from '@enums/date-range-type.enum';
import { ReconFilter } from '@enums/recon-filter.enum';
import { RouterStateParamsModel } from '@containers/shared/router-state.params.service';

export class BatchDataBaseParamsModel extends RouterStateParamsModel {
	sourceApplication?: string;
	eventIds?: string[];
	dateFrom?: string;
	dateTo?: string;
	dateRange?: DateRangeType;
	objectKey?: string;
	reconFilter?: ReconFilter;
	sort?: string;

	constructor(data?: BatchDataBaseParamsModel) {
		super(data);

		if(!data) {
			return;
		}

		this.sourceApplication = data.sourceApplication;
		this.eventIds = data.eventIds;
		this.dateRange = data.dateRange;
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
		this.objectKey = data.objectKey;
		this.reconFilter = ReconFilter[data.reconFilter];
		this.sort = data.sort;
	}
}
