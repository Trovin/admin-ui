import { Injectable } from '@angular/core';
import { HttpRestService } from '@core/http';

import { take } from 'rxjs/operators';

import { PageDto } from '@rest/shared/page.dto';

import { RedshiftTablesQueriesDto } from './index';

@Injectable()
export class RedshiftTablesService {
	constructor(private http: HttpRestService) { }

	getList(queries: RedshiftTablesQueriesDto) {
		const resource = '/redshift/tables';

		return this.http.get<PageDto<any>>(resource, queries)
			.pipe(
				take(1)
			);
	}
}
