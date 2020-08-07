import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http';

import { ReconciliationSourceTypesDto } from './reconciliation-source-types.dto';

@Injectable()
export class ReconciliationSourceTypesService {
	constructor(private http: HttpRestService) { }

	getList() {
		return this.http.get<ReconciliationSourceTypesDto[]>('/reconciliation-source-types')
			.pipe(
				take(1)
			);
	}
}
