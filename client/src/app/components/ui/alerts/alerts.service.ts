import { EventEmitter } from '@angular/core';

import { AlertType } from '@enums/alert-type.enum';

import { AlertModel } from '@components/ui/alerts/alert.model';

class AlertsService {
	change = new EventEmitter<AlertModel>();

	error(message: string) {
		this.show(new AlertModel({
			type: AlertType.ERROR,
			message: message
		}));
	}

	detailedError(message: string, details: {}, translate?: boolean) {
		this.show(new AlertModel({
			type: AlertType.ERROR,
			details: details,
			message: message
		}));
	}

	unauthorizedError(message: string, details: {}, translate?: boolean) {
		this.show(new AlertModel({
			type: AlertType.UNAUTHORIZED,
			details: details,
			message: message
		}));
	}

	chunkLoadErrorError(message: string) {
		this.show(new AlertModel({
			type: AlertType.CHUNK_LOAD_ERROR,
			message: message
		}));
	}

	success(message: string, translate?: boolean) {
		this.show(new AlertModel({
			type: AlertType.SUCCESS,
			message: message
		}));
	}

	private show(message: AlertModel) {
		if(!message.message) {
			return;
		}
		this.change.emit(message);
	}
}

export const alertsService = new AlertsService();
