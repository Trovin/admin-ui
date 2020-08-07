import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpEventType } from '@angular/common/http';

import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';

import { BucketConfigKey } from '@enums/bucket-config-key.enum';

import { S3DownloadQueriesDto, S3DownloadService } from '@rest/aws/s3/download/index';
import { RedshiftDataTableService, RedshiftDataTableQueriesDto } from '@rest/redshift/viewer/data-table';

@Component({
	selector: 'download-file-item',
	templateUrl: './download-file-item.component.html'
})

export class DownloadFileItemComponent implements OnInit, OnDestroy {
	@Input() params: RedshiftDataTableQueriesDto;
	@Input() autoSave: boolean;

	private subscriptions = new Subscription();
	private downloadSubscription: Subscription;
	private currentParams: RedshiftDataTableQueriesDto;
	private key: string;

	fileName: string;
	fileData: Blob;
	errorMessage: string;

	loaded = 0;
	total = 0;
	progressPercentage = 0;

	isCanceledDownload = false;
	isSuccessDownload = false;
	isDownloading = false;
	isCreatingFile = false;
	isAutoSave = false;

	constructor(
		private s3DownloadService: S3DownloadService,
		private redshiftDataTableService: RedshiftDataTableService
	) {}

	ngOnInit() {
		this.currentParams = new RedshiftDataTableQueriesDto(this.params);
		this.fileName = this.currentParams.tableName + '.csv';
		this.isAutoSave = this.autoSave;
		this.createFile();
	}

	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}

	private getFile() {
		const queries = new S3DownloadQueriesDto({
			tool: BucketConfigKey.DB_VIEWER,
			key: this.key
		});

		this.isDownloading = true;
		this.downloadSubscription = this.s3DownloadService
			.downloadFile(queries, 'download').subscribe(event => {
				switch (event.type) {
					case HttpEventType.DownloadProgress:
						this.progressPercentage = Math.floor( event.loaded * 100 / event.total );
						this.loaded = event.loaded;
						this.total = event.total;
						break;

					case HttpEventType.Response:
						event.status === 200 ? this.isSuccessDownload = true : this.remove();

						const data = event.body as Blob;
						this.isDownloading = false;

						this.isAutoSave ? saveAs(data, this.fileName) : this.fileData = data;
						this.subscriptions.unsubscribe();
						break;
				}
			}, errorResp => {
				this.errorMessage = errorResp.error.message;
				this.remove();
			});

		this.subscriptions.add(this.downloadSubscription);
	}

	private createFile() {
		this.isCreatingFile = true;
		this.isCanceledDownload = false;
		const sub = this.redshiftDataTableService
			.getFileKey(this.params).subscribe(resp => {
				this.key = resp.key;
				this.isCreatingFile = false;

				this.getFile();
			}, errorResp => {
				this.errorMessage = errorResp.error.message;
				this.remove();
			});

		this.subscriptions.add(sub);
	}

	download(data: Blob) {
		saveAs(data, this.fileName);
	}

	refresh() {
		this.errorMessage = '';
		this.createFile();
	}

	remove() {
		this.downloadSubscription.unsubscribe();
		this.progressPercentage = 0;
		this.loaded = 0;
		this.total = 0;
		this.isCanceledDownload = true;
		this.isDownloading = false;
	}
}
