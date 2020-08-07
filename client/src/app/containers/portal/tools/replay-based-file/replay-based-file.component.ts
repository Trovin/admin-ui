import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { alertsService } from '@components/ui';

import { environment } from '@environments/environment';

import { BucketConfigKey } from '@enums/bucket-config-key.enum';

import { PermissionAction } from '@enums/permission-actions.enum';
import { Containers } from '@config/containers.enum';

import { PaginationService } from '@containers/shared/pagination.service';

import { ReplacePipe } from '@components/ui/pipes/replace.pipe';

import { PageDto } from '@rest/shared/page.dto';
import { S3UploaderService } from '@rest/aws/s3/uploader';
import { S3DeleteFileQueriesDto, S3DeleteFileService } from '@rest/aws/s3/delete';
import { S3ReplayFilesQueriesDto, S3ReplayFilesService } from '@rest/aws/s3/replay-files';
import { S3CheckExistFilesService, S3CheckExistFilesQueriesDto, S3CheckExistFileDto } from '@rest/aws/s3/check-exist';
import { ReplayBasedFileDto, ReplayBasedFileQueriesDto, ReplayBasedFileService } from '@rest/replay-based-file';

import { ModalsService } from './modal/modals.service';

import { S3ReplayBasedFileModel } from './replay-based-file.model';

@Component({
	selector: 'replay-based-file',
	templateUrl: './replay-based-file.html',
	providers: [
		ReplayBasedFileService,
		S3CheckExistFilesService,
		S3ReplayFilesService,
		S3UploaderService,
		S3DeleteFileService,
		PaginationService,
		ModalsService,
		ReplacePipe
	]
})

export class ReplayBasedFileComponent implements OnInit {
	private params = new S3ReplayFilesQueriesDto();

	items: S3ReplayBasedFileModel[] = [];
	uploadFilesList: File[] = [];
	loading = false;
	isCheckingOnExistFiles = false;

	permission = PermissionAction;
	containers = Containers;

	constructor(
		private replayService: ReplayBasedFileService,
		private s3CheckExistFilesService: S3CheckExistFilesService,
		private s3UploaderService: S3UploaderService,
		private service: S3ReplayFilesService,
		private s3DeleteFileService: S3DeleteFileService,
		private modalsService: ModalsService,
		public pagination: PaginationService
	) {}

	ngOnInit() {
		this.fetchFiles();
	}

	fetchFiles() {
		this.loading = true;

		this.service
			.getList(this.params)
			.pipe(
				map(resp => {
					const data = new PageDto<S3ReplayBasedFileModel>();
					data.pagination = resp.pagination;
					data.content = resp.content.map((item) => {
						return new S3ReplayBasedFileModel({
							...item,
							replayInProcess: false,
							deleteInProcess: false
						});
					});
					return data;
				})
			)
			.subscribe(
				data => {
					this.loading = false;
					this.items = data.content;
					this.pagination.init(data.pagination);
				},
				() => {
					this.items = [];
					this.loading = false;
				}
			);
	}

	uploadFiles(input: HTMLInputElement) {
		if(!input.files.length) {
			return;
		}

		this.uploadFilesList = this.createUploadFilesList(input.files);

		this.checkExistFilesOnS3();

		input.value = '';
	}

	delete(item: S3ReplayBasedFileModel) {
		const msg = `Do you want to confirm deletion the file <b>${item.objectKey}</b>?`;

		this.modalsService.openConfirmModal(msg)
			.subscribe((status) => {
				if(status) {
					const query = new S3DeleteFileQueriesDto({
						tool: BucketConfigKey.FILES_STORAGE,
						key: encodeURIComponent(item.objectKey)
					});
					item.deleteInProcess = true;
					this.s3DeleteFileService.delete(query)
						.subscribe(
							() => {
								alertsService.success('Successfully deleted');
								this.fetchFiles();
								item.deleteInProcess = false;
							},
							() => item.deleteInProcess = false
						);
				}
			});
	}

	replay(item: S3ReplayBasedFileModel) {
		const params = new ReplayBasedFileQueriesDto({
			objectKey: item.objectKey
		});

		item.replayInProcess = true;

		this.replayService
			.put(params)
			.subscribe(
				(r: ReplayBasedFileDto) => {
					item.replayInProcess = false;
					alertsService.success(r.message);
				},
				() => item.replayInProcess = false
			);
	}

	pageChanged(page: number) {
		this.params.page = page;
		this.pagination.setPage(page); // @TODO: temporary fix for pagination
		this.fetchFiles();
	}

	private createUploadFilesList(files: FileList) {
		const uploadFilesList = [];

		for(let i = 0, length = files.length; i < length; i++) {
			uploadFilesList.push(files[i]);
		}

		return uploadFilesList;
	}

	private checkExistFilesOnS3() {
		this.isCheckingOnExistFiles = true;

		const filesKeys = this.uploadFilesList.map(file => `replay/csv/${encodeURIComponent(file.name)}`);
		const checkOptions = new S3CheckExistFilesQueriesDto({
			bucket: BucketConfigKey.getBucketName(BucketConfigKey.FILES_STORAGE, environment.env),
			keys: filesKeys
		});

		this.s3CheckExistFilesService
			.check(checkOptions)
			.subscribe(
				data => {
					data.length ? this.createConfirmModal(checkOptions.bucket, data) : this.onUpload();
					this.isCheckingOnExistFiles = false;
				},
				() => this.isCheckingOnExistFiles = false
			);

	}

	private createConfirmModal(bucket: string, data: S3CheckExistFileDto[] = []) {
		const files = data ? data.map(e => e.key).join(', ') : '';
		const msg = `
			Such file(s) already exist in <b>${bucket}</b>: ${files}.
			<p>Would you like to overwrite?</p>
		`;

		this.modalsService.openConfirmModal(msg)
			.subscribe(isConfirm => isConfirm ? this.onUpload() : this.resetUploadFilesList());
	}

	private resetUploadFilesList() {
		this.uploadFilesList.splice(0);
	}

	private onUpload() {
		const observableList = this.uploadFilesList.map(file => {
			const query = this.createUploadFileQuery(file);
			return this.s3UploaderService.upload(query);
		});

		forkJoin(observableList)
			.subscribe(
				() => {
					alertsService.success(`Successfully upload ${this.uploadFilesList.length} file(s)`);
					this.resetUploadFilesList();
					this.fetchFiles();
				},
				() => this.resetUploadFilesList()
			);
	}

	private createUploadFileQuery(file: File) {
		const formData = new FormData();
		formData.append('file', file);
		const query = {
			formData: formData,
			key: `replay/csv/${encodeURIComponent(file.name)}`,
			bucketConfigKey: BucketConfigKey.FILES_STORAGE,
			url: 'upload',
			autoUpload: true
		};
		return query;
	}
}
