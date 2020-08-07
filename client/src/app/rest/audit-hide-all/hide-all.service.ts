import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http/index';

import { AuditHideAllQueriesDto } from './hide-all.queries.dto';

@Injectable()
export class AuditHideAllService {
	constructor(private http: HttpRestService) {}

	put(process: string, body: AuditHideAllQueriesDto) {
		const url = `/hide/${process}/all`;
		return this.http
			.update(url, body)
			.pipe(
				take(1)
			);
	}
}
