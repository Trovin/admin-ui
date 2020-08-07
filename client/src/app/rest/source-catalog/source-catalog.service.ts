import { Injectable } from '@angular/core';

import { take, map } from 'rxjs/operators';

import { HttpRestService } from '@core/http';

import { PageDto } from '@rest/shared/page.dto';

import { SourceCatalogModel } from './source-catalog.model';
import { SourceCatalogDto } from './source-catalog.dto';
import { SourceCatalogQueriesDto } from './source-catalog.queries.dto';
import { SourceCatalogSourceApplicationsDto } from './source-application.dto';

@Injectable()
export class SourceCatalogService {
	constructor(private http: HttpRestService) { }

	getList(queries: SourceCatalogQueriesDto) {
		return this.http.get<PageDto<SourceCatalogDto>>('/source-catalog', queries)
			.pipe(
				map(resp => {
					const data = new PageDto<SourceCatalogModel>();

					data.pagination = resp.pagination;
					data.content= resp.content.map(e => new SourceCatalogModel({
						sourceApplication: e.sourceApplication,
						eventId: e.eventId,
						isReconActive: e.isReconActive,
						isReconConfigExists: e.isReconConfigExists,
						disabled: !e.isReconConfigExists,
						appliedDate: e.appliedDate,
						appliedUser: e.appliedUser,
						isBatch: e.isBatch,
						bucketName: e.bucketName,
						loading: false,
						inputFilesPageUrl: e.isBatch ? '/portal/input-files/batch' : '/portal/input-files/real-time'
					}));

					return data;
				}
			)
		);
	}

	getSourceApplications() {
		return this.http.get<SourceCatalogSourceApplicationsDto[]>('/source-catalog/source-applications')
			.pipe(
				take(1)
			);
	}
}
