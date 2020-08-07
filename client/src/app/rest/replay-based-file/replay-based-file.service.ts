import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http/index';

import { ReplayBasedFileQueriesDto } from './replay-based-file.queries.dto';

@Injectable()
export class ReplayBasedFileService {
	constructor(private http: HttpRestService) {}

	put(body: ReplayBasedFileQueriesDto) {
		return this.http
			.update('/replay-based-file', body)
			.pipe(
				take(1)
			);
	}
}
