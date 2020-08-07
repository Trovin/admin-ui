import { Injectable } from '@angular/core';
import { HttpRestService } from '@core/http';

import { take } from 'rxjs/operators';

import { RedshiftStatusDto, RedshiftQueryStatusDto } from './index';

@Injectable()
export class RedshiftStatusService {
	constructor(private http: HttpRestService) { }

	getStatus() {
		const resource = '/redshift/status';

		return this.http.get<RedshiftStatusDto[]>(resource)
			.pipe(
				take(1)
			);
	}

	getQueriesStatuses() {
		const resource = '/redshift/queries-statuses';

		return this.http.get<RedshiftQueryStatusDto[]>(resource)
			.pipe(
				take(1)
			);
	}
}
