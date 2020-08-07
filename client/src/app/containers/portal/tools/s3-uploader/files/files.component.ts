import { Component, OnChanges, SimpleChanges, Output, Input, EventEmitter } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { Subject } from 'rxjs';

import { alertsService } from '@components/ui/index';
import { saveAs } from 'file-saver';

import { SortDirection } from '@enums/sort-direction.enum';

import { AutoConfigColumnTypeEnum } from '@enums/auto-conf-column-type.enum';
import { PaginationService } from '@containers/shared/pagination.service';

import { S3BucketFileDto, S3BucketFilesQueriesDto, S3BucketFilesService } from '@rest/aws/s3/bucket-files';
import { S3DownloadQueriesDto, S3DownloadService } from '@rest/aws/s3/download';

import { S3UploaderRouterStateParamsModel } from './../shared/router-state-params.model';
import { S3UploaderQueriesModel } from './../s3-uploader-queries.model';

@Component({
	selector: 'files-list',
	templateUrl: './files.html',
	providers: [
		S3BucketFilesService,
		S3DownloadService,
		PaginationService
	]
})

export class FilesListComponent implements OnChanges {
	// @TODO: mutable object. Would be great to use service
	@Input() stateParams: S3UploaderQueriesModel = new S3UploaderQueriesModel();
	@Input() loading = false;
	@Output() changed = new EventEmitter<S3UploaderRouterStateParamsModel>();

	items: S3BucketFileDto[] = [];
	sortSubj = new Subject<string>();
	params: S3UploaderRouterStateParamsModel = new S3UploaderRouterStateParamsModel({});

	columnType = AutoConfigColumnTypeEnum;
	timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	constructor(
		public pagination: PaginationService,
		private bucketFilesService: S3BucketFilesService,
		private downloadService: S3DownloadService
	) {}

	ngOnChanges(change: SimpleChanges) {
		const stateParams = change['stateParams'];
		if(stateParams && stateParams.currentValue && !stateParams.firstChange) {
			if(this.stateParams.bucket !== this.params.bucket && this.stateParams.path !== this.params.path) {
				this.items = [];
			}

			this.configParams(this.stateParams);
			this.configSortBy(this.params.sort);
			this.fetch(true);
		}
	}

	search() {
		this.resetPage();
		this.changed.emit(this.params);
	}

	fetch(resetPage?: boolean) {
		if(!this.params.bucket || !this.params.path) {
			return;
		}

		if(resetPage) {
			this.pagination.resetPage();
		}

		this.loading = true;

		const queries = new S3UploaderQueriesModel({
			bucket: this.params.bucket,
			key: this.params.path,
			sort: this.params.sort,
			page: this.params.page,
			search: this.params.search
		});

		this.bucketFilesService.getList(queries, 'file-list')
			.subscribe(
				data => {
					this.items = data.content.map(item => {
						return {
							name: item.objectKey.replace(this.params.path, ''),
							objectKey: item.objectKey,
							lastModified: item.lastModified
						};
					});
					this.loading = false;
					this.pagination.init(data.pagination);
				},
				() => {
					this.items = [];
					this.loading = false;
				}
			);
	}

	resetPage() {
		this.pagination.page = 1;
		this.params.page = 1;
	}

	pageChanged(page: number) {
		this.params.page = page;
		this.pagination.setPage(page);
		this.changed.emit(this.params);
	}

	configParams(params?: S3BucketFilesQueriesDto) {
		this.params = Object.assign({}, this.params, params);
	}

	changedSortBy(sort: string) {
		this.resetPage();

		this.configSortBy(sort);
		this.configParams(this.params);

		this.changed.emit(this.params);
	}

	download(file: S3BucketFileDto) {
		const queries = new S3DownloadQueriesDto({
			bucket: this.params.bucket,
			key: encodeURIComponent(file.objectKey)
		});

		this.downloadService
			.downloadFile(queries, 'download-protected')
			.subscribe(
				event => {
					if(event.type === HttpEventType.Response) {
						alertsService.success('Successfully download');
						const fileName = file.objectKey.split('/').pop();
						const data = event.body as Blob;
						saveAs(data, fileName);
					}
				}
			);
	}

	private configSortBy(sort: string) {
		const sortBy = sort || this.createDefaultSortBy();
		this.params.sort = sortBy;
		this.sortSubj.next(sortBy);
	}

	private createDefaultSortBy() {
		return `${this.columnType.DATE},${SortDirection.DESC}`;
	}
}
