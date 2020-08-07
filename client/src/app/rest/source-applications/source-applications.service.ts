import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';

import { HttpRestService } from '@core/http';

import { SourceApplicationDto } from './source-applications.dto';

@Injectable()
export class SourceApplicationsService {
	constructor(private http: HttpRestService) { }

	getList(process: string) {
		return this.http.get<SourceApplicationDto[]>(`/processes/${process}/source-applications`)
			.pipe(
				take(1)
			);
	}
}
