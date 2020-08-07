import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http';

import { AWSSendEmailQueriesDto } from './index';

@Injectable()
export class AWSSendEmailService {
	constructor(private http: HttpRestService) { }

	sendData(queries: AWSSendEmailQueriesDto) {
		const resource = '/aws/send-email';
		return this.http.create(resource, {params:queries})
			.pipe(
				take(1)
			);
	}
}
