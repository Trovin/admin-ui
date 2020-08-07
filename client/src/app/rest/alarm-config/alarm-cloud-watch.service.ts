import { Injectable } from '@angular/core';
import { HttpRestService } from '@core/http';

import { take } from 'rxjs/operators';

import { CloudWatchAlarmDto } from './index';

@Injectable()
export class CloudWatchAlarmService {
	constructor(private http: HttpRestService) { }

	getList() {
		const resource = '/aws/cloud-watch/alarm-data';
		return this.http.get<CloudWatchAlarmDto[]>(resource)
			.pipe(
				take(1)
			);
	}
}
