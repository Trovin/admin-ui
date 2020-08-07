import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http';

import { PageDto } from '@rest/shared/page.dto';

import { ReconciliationDto } from './reconciliation.dto';
import { ReconciliationStateDto } from './reconciliation-state.dto';

@Injectable()
export class ReconciliationService {
	constructor(private http: HttpRestService) { }

	getList(queries: any) {
		return this.http.get<PageDto<ReconciliationDto>>('/reconciliation', queries)
			.pipe(
				take(1)
			);
	}

	toggleState(queries: ReconciliationStateDto) {
		return this.http.update('/reconciliation-files/state', queries)
			.pipe(
				take(1)
			);
	}
}
