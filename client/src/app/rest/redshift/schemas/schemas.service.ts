import { Injectable } from '@angular/core';
import { HttpRestService } from '@core/http';

import { take } from 'rxjs/operators';

import { RedshiftSchemaDto, RedshiftSchemaQueriesDto } from './index';

@Injectable()
export class RedshiftSchemasService {
	constructor(private http: HttpRestService) { }

	getList(queries: RedshiftSchemaQueriesDto) {
		const resource = '/redshift/schemas';

		return this.http.get<RedshiftSchemaDto[]>(resource, queries)
			.pipe(
				take(1)
			);
	}
}
