import { AlertType } from '@enums/alert-type.enum';

export class AlertModel {
	type: AlertType;
	message: string;
	index?: number;
	details?: {[key: string]: string};

	constructor(data: AlertModel) {
		if(!data) {
			return;
		}

		this.type = data.type;
		this.message = data.message;
		this.index = data.index;
		this.details = data.details;
	}
}
