import { Injectable } from '@angular/core';
import { HttpRestService } from '@core/http';

import { take } from 'rxjs/operators';

import { RedshiftViewerConfigDto } from './index';

@Injectable()
export class RedshiftViewerConfigService {
	constructor(private http: HttpRestService) { }

	getList() {
		const resource = '/redshift/viewer-config';

		return this.http.get<RedshiftViewerConfigDto[]>(resource)
			.pipe(
				take(1)
			);
	}
}
