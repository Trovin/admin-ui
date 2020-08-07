export class WidgetImageQueriesDto {
	widgetDefinition: string;
	dateFrom?: string;
	dateTo?: string;
	period?: number;
	createdDate?: string;
	updatedDate?: string;

	constructor(data?: WidgetImageQueriesDto) {
		if(!data) {
			return;
		}

		this.widgetDefinition = data.widgetDefinition;
		this.dateFrom = data.dateFrom;
		this.dateTo = data.dateTo;
		this.period = data.period;
		this.createdDate = data.createdDate;
		this.updatedDate = data.updatedDate;
	}
}
