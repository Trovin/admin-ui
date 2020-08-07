import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http/index';

import { AuditHideQueriesDto } from './hide.queries.dto';

@Injectable()
export class AuditHideService {
	constructor(private http: HttpRestService) {}

	put(process: string, body: AuditHideQueriesDto) {
		const url = `/hide/${process}`;
		return this.http
			.update(url, body)
			.pipe(
				take(1)
			);
	}
}
