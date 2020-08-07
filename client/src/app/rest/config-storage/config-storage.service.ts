import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpRestService } from '@core/http';

import { take } from 'rxjs/operators';

import { ConfigStorageQueriesDto, ConfigStorageItemDto, ConfigStorageUpdateDto, ConfigStorageUpdateQueriesDto, ConfigStorageStructureDto, ConfigStorageSourceListQueriesDto, ConfigStorageSourceItemDto } from './index';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class ConfigStorageService {

	constructor(
		private sanitizer: DomSanitizer,
		private httpClient: HttpClient,
		private http: HttpRestService
	) { }

	getList(query: ConfigStorageQueriesDto) {
		const resource = '/configuration/list';
		return this.http.get<ConfigStorageItemDto[]>(resource, query)
			.pipe(
				take(1)
			);
	}

	getStructList() {
		const resource = '/configuration/structure-list';
		return this.http.get<ConfigStorageStructureDto[]>(resource)
			.pipe(
				take(1)
			);
	}

	getSourceList(query: ConfigStorageSourceListQueriesDto) {
		const resource = '/configuration/source-list';
		return this.http.create<ConfigStorageSourceItemDto[]>(resource, query.body)
			.pipe(
				take(1)
			);
	}

	updateFromCSV(body: ConfigStorageUpdateQueriesDto) {
		const resource = '/configuration/update-from-csv';
		return this.http.create<ConfigStorageUpdateDto>(resource, body)
			.pipe(
				take(1)
			);
	}
}
