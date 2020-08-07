import { Injectable } from '@angular/core';
import { HttpRestService } from '@core/http';

import { take } from 'rxjs/operators';

import { S3UploaderConfigDto } from './index';

@Injectable()
export class S3UploaderConfigService {
	constructor(private httpRestService: HttpRestService) { }

	getList() {
		const resource = '/aws/s3/upload-config';

		return this.httpRestService.get<S3UploaderConfigDto[]>(resource)
			.pipe(
				take(1)
			);
	}
}
