import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { HttpRestService } from '@core/http';

import { AuditErrorsCountQueriesDto } from './errors-count.queries.dto';
import { AuditErrorsCountDto } from './errors-count.dto';

@Injectable()
export class AuditErrorsCountService {
	constructor(private http: HttpRestService) {}

	get(process: string, queries: AuditErrorsCountQueriesDto): Observable<AuditErrorsCountDto> {
		const url = `/audit/${process}/errors-count`;
		return this.http
			.get(url, queries)
			.pipe(
				take<AuditErrorsCountDto>(1)
			);
	}
}
