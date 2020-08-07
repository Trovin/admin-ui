import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http';

import { ReconciliationGroupDto } from './reconciliation-group.dto';

@Injectable()
export class ReconciliationGroupService {
	constructor(private http: HttpRestService) { }

	getList() {
		return this.http.get<ReconciliationGroupDto[]>('/reconciliation-group')
			.pipe(
				take(1)
			);
	}
}
