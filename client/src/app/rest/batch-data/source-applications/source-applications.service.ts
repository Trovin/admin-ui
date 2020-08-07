import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http';

import { BatchDataSourceApplicationDto } from './source-application.dto';

@Injectable()
export class BatchDataSourceApplicationsService {
	constructor(private http: HttpRestService) {}

	getList(bucket: string) {
		const resource = `/input-files/${bucket}/source-applications`;

		return this.http.get<BatchDataSourceApplicationDto>(resource)
			.pipe(
				take(1)
			);
	}
}
