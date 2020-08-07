import { Injectable } from '@angular/core';
import { HttpRestService } from '@core/http';

import { take } from 'rxjs/operators';

import { PageDto } from '@rest/shared/page.dto';

import { RedshiftDdlQueriesDto } from './redshift-ddl.queries.dto';
import { RedshiftDdlDto } from './redshift-ddl.dto';

@Injectable()
export class RedshiftDdlService {
	constructor(private http: HttpRestService) { }

	getList(queries: RedshiftDdlQueriesDto) {
		const resource = '/audit/redshift-ddls';

		return this.http.get<PageDto<RedshiftDdlDto>>(resource, queries)
			.pipe(
				take(1)
			);
	}
}
