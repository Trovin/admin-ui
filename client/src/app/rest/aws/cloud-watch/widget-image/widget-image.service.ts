import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { HttpRestService } from '@core/http';

import { WidgetImageDto } from './widget-image.dto';
import { WidgetImageQueriesDto } from './widget-image.queries.dto';

@Injectable()
export class CloudWatchWidgetImageService {
	constructor(private http: HttpRestService) {}

	getWidgets(): Observable<WidgetImageDto[]> {
		const resource = '/aws/cloud-watch/widgets-image';

		return this.http.get<WidgetImageDto[]>(resource);
	}

	getWidgetImage(id: string, queries: WidgetImageQueriesDto): Observable<WidgetImageDto> {
		const resource = `/aws/cloud-watch/widgets-image/${id}`;

		return this.http.create(resource, queries);
	}

	create(queries: WidgetImageQueriesDto): Observable<WidgetImageDto> {
		const resource = '/aws/cloud-watch/widgets-image/generate-config';

		return this.http.create(resource, queries);
	}

	update(id: string, queries: WidgetImageQueriesDto): Observable<WidgetImageDto> {
		const resource = `/aws/cloud-watch/widgets-image/${id}/update`;

		return this.http.update(resource, queries);
	}

	delete(id: string): Observable<WidgetImageDto> {
		const resource = `/aws/cloud-watch/widgets-image/${id}/delete`;

		return this.http.delete(resource);
	}
}
