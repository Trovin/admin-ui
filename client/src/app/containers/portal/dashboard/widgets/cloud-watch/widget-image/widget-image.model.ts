import { WidgetImageDto } from '@rest/aws/cloud-watch/widget-image';

export class CloudWatchWidgetImageModel extends WidgetImageDto {
	loading?: boolean;
	dateFrom?: string;
	dateTo?: string;
	period?: number;
	href?: string;

	constructor(data?: CloudWatchWidgetImageModel) {
		super(data);

		if(!data) {
			return;
		}

		this.loading = data.loading;
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
		this.period = data.period;
		this.href = data.href;
	}
}
