import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { alertsService } from '@components/ui';

@Injectable()
export class ErrorsHandler implements ErrorHandler {
	handleError(error: Error | HttpErrorResponse) {
		this.handleClientError(error);
	}

	private handleClientError(data: any) {
		const error = data || '';
		const errroMessage: string = error.message || error;
		const chunkFailedMessage = 'ChunkLoadError: Loading chunk';

		if(errroMessage.includes(chunkFailedMessage)) {
			alertsService.chunkLoadErrorError(`${chunkFailedMessage} failed. Try to reload the page.`);
		}

		console.info(error);
	}
}