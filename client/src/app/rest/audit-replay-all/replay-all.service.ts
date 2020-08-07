import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http/index';

import { AuditReplayAllQueriesDto } from './replay-all.queries.dto';

@Injectable()
export class AuditReplayAllService {
	constructor(private http: HttpRestService) {}

	put(process: string, body: AuditReplayAllQueriesDto) {
		const url = `/replay/${process}/all`;
		return this.http
			.update(url, body)
			.pipe(
				take(1)
			);
	}
}
