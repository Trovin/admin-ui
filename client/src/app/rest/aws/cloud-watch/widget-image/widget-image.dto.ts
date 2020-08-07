export class WidgetImageDto {
	widgetDefinition: any;
	uuid: string;
	image: string;
	err?: string;
	createdDate: string;
	updatedDate: string;

	constructor(data: WidgetImageDto) {
		if(!data) {
			return;
		}

		this.widgetDefinition = data.widgetDefinition;
		this.uuid = data.uuid;
		this.image = data.image;
		this.err = data.err;
		this.createdDate = data.createdDate;
		this.updatedDate = data.updatedDate;
	}
}
