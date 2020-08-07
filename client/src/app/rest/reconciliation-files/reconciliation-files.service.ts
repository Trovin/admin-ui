import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { HttpRestService } from '@core/http';

import { ReconciliationFileDto } from './reconciliation-file.dto';
import { ReconciliationFilesQueriesDto } from './reconciliation-files.queries.dto';
import { ReconciliationAllFilesQueriesDto } from './reconciliation-all-files.queries.dto';

@Injectable()
export class ReconciliationFilesService {
	constructor(private http: HttpRestService) { }

	reconcile(body: ReconciliationFilesQueriesDto): Observable<ReconciliationFileDto> {
		return this.http.create('/reconciliation-files', body)
			.pipe(
				map((i: ReconciliationFileDto) => new ReconciliationFileDto(i))
			);
	}

	reconcileAll(body: ReconciliationAllFilesQueriesDto): Observable<ReconciliationFileDto> {
		return this.http.create('/reconciliation-all-files', body)
			.pipe(
				map((i: ReconciliationFileDto) => new ReconciliationFileDto(i))
			);
	}
}
