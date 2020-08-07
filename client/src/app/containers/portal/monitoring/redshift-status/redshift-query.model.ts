import { RedshiftQueryStatusDto } from '@rest/redshift-status';

export class MonitoringQueryStatusModel extends RedshiftQueryStatusDto {
	isShowMore?: boolean;

	constructor(data?: MonitoringQueryStatusModel) {
		super(data);

		if(!data) {
			return;
		}

		this.isShowMore = data.isShowMore;
	}
}
