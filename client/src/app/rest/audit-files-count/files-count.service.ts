import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { HttpRestService } from '@core/http/index';

import { AuditFilesCountQueriesDto } from './files-count.queries.dto';
import { AuditFileCountDto } from './file-count.dto';

@Injectable()
export class AuditFilesCountService {
	constructor(private http: HttpRestService) {}

	get(process: string, queries: AuditFilesCountQueriesDto): Observable<AuditFileCountDto> {
		const url = `/audit/${process}/files-count`;
		return this.http
			.get(url, queries)
			.pipe(
				take<AuditFileCountDto>(1)
			);
	}
}
