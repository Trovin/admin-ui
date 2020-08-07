import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http';

import { AlarmPipelineErrorDto } from './index';

@Injectable()
export class AlarmPipelineErrorsService {
	constructor(private http: HttpRestService) { }

	getList() {
		const resource = '/alarm/pipeline-errors';
		return this.http.get<AlarmPipelineErrorDto[]>(resource)
			.pipe(
				take(1)
			);
	}
}