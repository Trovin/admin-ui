import { Injectable } from '@angular/core';
import { HttpRestService } from '@core/http';

import { take } from 'rxjs/operators';

import { RedshiftDataTableDto, RedshiftDataTableQueriesDto, RedshiftDataTableFileKeyDto } from './index';

@Injectable()
export class RedshiftDataTableService {
	constructor(private http: HttpRestService) { }

	getFileKey(queries: RedshiftDataTableQueriesDto) {
		const resource = '/redshift/data-table-file-key';

		return this.http.get<RedshiftDataTableFileKeyDto>(resource, queries)
			.pipe(
				take(1)
			);
	}

	getList(queries: RedshiftDataTableQueriesDto) {
		const resource = '/redshift/data-table';

		return this.http.get<RedshiftDataTableDto>(resource, queries)
			.pipe(
				take(1)
			);
	}
}
