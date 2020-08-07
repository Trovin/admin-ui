import { Injectable } from '@angular/core';
import { HttpRestService } from '@core/http';

import { take } from 'rxjs/operators';

import { MissingConfigDto } from './index';
import { MissingConfigsDeleteQueriestDto } from './missing-configs-delete.queries.dto';

@Injectable()
export class MissingConfigsService {
	constructor(private http: HttpRestService) {}

	getList() {
		const resource = '/missing-configs';

		return this.http.get<MissingConfigDto[]>(resource)
			.pipe(
				take(1)
			);
	}

	delete(process: string, queries: MissingConfigsDeleteQueriestDto) {
		const resource = `/missing-configs/${process}/delete`;

		return this.http.delete<MissingConfigDto[]>(resource, {params: queries})
			.pipe(
				take(1)
			);
	}
}
