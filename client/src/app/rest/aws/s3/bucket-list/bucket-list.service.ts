import { Injectable } from '@angular/core';
import { HttpRestService } from '@core/http';

import { take } from 'rxjs/operators';

import { S3BucketDto } from './bucket.dto';

@Injectable()
export class S3BucketListService {
	constructor(private http: HttpRestService) { }

	getList() {
		const resource = '/aws/s3/bucket-list';
		return this.http.get<S3BucketDto[]>(resource)
			.pipe(
				take(1)
			);
	}
}
