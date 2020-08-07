import { Injectable } from '@angular/core';

import { HttpRestService } from '@core/http';

import { map } from 'rxjs/operators';

import { RedshiftTablesDiffDto } from './redshift-tables-diff.dto';
import { RedshiftTablesDiffTableDto } from './redshift-tables-diff-table.dto';

@Injectable()
export class RedshiftTablesDiffService {
	constructor(private http: HttpRestService) { }

	getList() {
		return this.http.get<RedshiftTablesDiffDto[]>('/redshift-tables-diff')
			.pipe(
				map(resp => {
					return resp.map(e => new RedshiftTablesDiffDto(e));
				})
			);
	}

	getDifferences(schema: string, table: string) {
		return this.http.get<RedshiftTablesDiffTableDto>(`/redshift-tables-diff/${schema}/${table}`, null);
	}
}
