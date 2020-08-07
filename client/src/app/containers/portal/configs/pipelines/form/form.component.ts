import { Component, Input, Output, OnDestroy, EventEmitter } from '@angular/core';

import { forkJoin } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';

import { PermissionAction } from '@enums/permission-actions.enum';
import { Containers } from '@config/containers.enum';

import { alertsService } from '@components/ui';
import { BucketConfigKey } from '@enums/bucket-config-key.enum';

import { S3BucketFilesQueriesDto } from '@rest/aws/s3/bucket-files';
import { S3UploaderQueriesDto, S3UploaderService } from '@rest/aws/s3/uploader';
import { S3CheckExistFilesQueriesDto, S3CheckExistFilesService, S3CheckExistFileDto } from '@rest/aws/s3/check-exist';

import { ModalsService } from './../modal/modals.service';

import { AutoConfigActionsListModel } from './../pipelines-configs.models';

@Component({
	selector: 'auto-conf-files-form',
	templateUrl: './form.html',
	styleUrls: ['./form.scss'],
	providers: [
		S3UploaderService,
		ModalsService,
		S3CheckExistFilesService
	]
})

export class AutoConfFilesFormComponent implements OnDestroy {
	@Output() changed = new EventEmitter<never>();

	@Output() downloadSelected = new EventEmitter<never>();
	@Output() executeSelected = new EventEmitter<never>();

	@Input() loading = false;
	@Input() actionsLists: AutoConfigActionsListModel;

	private sub = new Subscription();
	private uploadFilesList: File[] = [];

	private bucketName: string;
	private sourceName: string;

	permission = PermissionAction;
	containers = Containers;
	isCheckingOnExistFiles = false;
	params = new S3BucketFilesQueriesDto({
		search: ''
	});

	constructor(
		private s3UploaderService: S3UploaderService,
		private s3CheckExistFilesService: S3CheckExistFilesService,
		private modalsService: ModalsService
	) {}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	configS3Params(bucketName: string, sourceName: string) {
		this.bucketName = bucketName;
		this.sourceName = sourceName + '/';
	}

	submit() {
		this.changed.emit();
	}

	downloadSelectedConfigs() {
		this.downloadSelected.emit();
	}

	executeSelectedConfigs() {
		this.executeSelected.emit();
	}

	refresh() {
		this.changed.emit();
	}

	reset() {
		this.params.search = null;
		this.changed.emit();
	}

	uploadFiles(input: HTMLInputElement) {
		if(!input.files.length) {
			return;
		}

		this.createUploadFilesList(input.files);

		input.value = '';
	}

	private createUploadFilesList(files: FileList) {
		for(let i = 0, length = files.length; i < length; i++) {
			const item = files[i];
			const isUploadingFile = this.isInProgressUpload(item);
			if(!isUploadingFile) {
				this.uploadFilesList.push(item);
			}
		}

		if(this.uploadFilesList.length) {
			this.checkExistFilesOnS3();
		}
	}

	private checkExistFilesOnS3() {
		this.isCheckingOnExistFiles = true;

		const filesKeys = this.uploadFilesList.map(file => encodeURIComponent(this.sourceName + file.name));
		const checkOptions = new S3CheckExistFilesQueriesDto({
			bucket: this.bucketName,
			keys: filesKeys
		});

		const sub = this.s3CheckExistFilesService
			.check(checkOptions)
			.subscribe(data => {
				data.length ? this.createConfirmModal(data) : this.onUpload();
				this.isCheckingOnExistFiles = false;
			});

		this.sub.add(sub);
	}

	private createConfirmModal(data: S3CheckExistFileDto[]) {
		const msg = `Such file(s) already exist in ${this.bucketName}. Would you like to overwrite?`;

		this.modalsService.openConfirmModal(msg)
			.subscribe(isConfirm => {
				isConfirm ? this.onUpload() : this.resetUploadFilesList();
			});
	}

	private onUpload() {
		const uploadFiles = this.uploadFilesList;
		const observableList = uploadFiles.map(file => {
			const query = this.createUploadFileQuery(file);

			this.actionsLists.uploadList.push(file);
			return this.s3UploaderService.upload(query);
		});

		this.resetUploadFilesList();

		forkJoin(observableList).subscribe(
			results => {
				alertsService.success(`Successfully upload ${uploadFiles.length} file(s)`);
				this.actionsLists.uploadList = this.deleteFilesFromList(this.actionsLists.uploadList, uploadFiles);
			},
			e => {
				this.actionsLists.uploadList = this.deleteFilesFromList(this.actionsLists.uploadList, uploadFiles);
			});
	}

	private createUploadFileQuery(file: File): S3UploaderQueriesDto {
		const formData = new FormData();
		formData.append('file', file);

		const query = new S3UploaderQueriesDto({
			formData: formData,
			key: this.sourceName + encodeURIComponent(file.name),
			bucketConfigKey: BucketConfigKey.PIPELINE_CONFIGS,
			url: 'upload',
			autoUpload: true
		});

		return query;
	}

	private deleteFilesFromList(files: File[], deleteFilesList: File[]): File[] {
		return files.filter(item => !deleteFilesList.some(config => config.name === item.name));
	}

	private resetUploadFilesList() {
		this.uploadFilesList = [];
	}

	private isInProgressUpload(file: File): boolean {
		return this.actionsLists.uploadList.some(item => file.name == item.name);
	}
}
