import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import { HttpRestService } from '@core/http';


import { RedshiftEmptyRecordDto } from './record.dto';
import { RedshiftEmptyRecordColumnDto } from './record-column.dto';
import { RedshiftEmptyRecordsColumnsQueriesDto } from './records-columns.queries.dto';
import { RedshiftEmptyRecordsQueriesDto } from './records.queries.dto';
import { RedshiftMetricsTablesColumnsIgnoreStateQueriesDto } from './records-columns-ignore-state.queries.dto';
import { PageDto } from '@rest/shared/page.dto';

@Injectable()
export class RedshiftEmptyRecordsService {
	constructor(private http: HttpRestService) { }

	getTables(queries: RedshiftEmptyRecordsQueriesDto) {
		return this.http.get<PageDto<RedshiftEmptyRecordDto>>('/monitoring/redshift-metrics-tables', queries)
			.pipe(
				map(resp => {
					const data = resp;
					const list = resp.content.map(i => new RedshiftEmptyRecordDto(i));
					data.content = list;

					return data;
				})
			);
	}

	getColumns(table: string, queries: RedshiftEmptyRecordsColumnsQueriesDto) {
		return this.http.get<RedshiftEmptyRecordColumnDto[]>(`/monitoring/redshift-metrics-tables/${table}/columns`, queries)
			.pipe(
				map(resp => resp.map(e => new RedshiftEmptyRecordColumnDto(e)))
			);
	}

	toggleIgnoreState(table: string, column: string, queries: RedshiftMetricsTablesColumnsIgnoreStateQueriesDto) {
		return this.http.update(`/monitoring/redshift-metrics-tables/${table}/columns/${column}/ignore`, queries);
	}
}
