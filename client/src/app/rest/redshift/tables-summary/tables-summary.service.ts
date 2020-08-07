import { Injectable } from '@angular/core';
import { HttpRestService } from '@core/http';

import { take } from 'rxjs/operators';

import { RedshiftTablesSummaryQueriesDto, RedshiftTablesSummaryDto } from './index';

@Injectable()
export class RedshiftTablesSummaryService {
	constructor(private http: HttpRestService) { }

	getList(queries: RedshiftTablesSummaryQueriesDto) {
		const resource = '/redshift/tables-summary';

		return this.http.get<RedshiftTablesSummaryDto[]>(resource, queries)
			.pipe(
				take(1)
			);
	}
}
