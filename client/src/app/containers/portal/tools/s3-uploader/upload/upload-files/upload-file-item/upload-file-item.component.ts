import { Component, Input, Output, OnChanges, SimpleChanges, ViewChild, EventEmitter } from '@angular/core';
import { HttpEventType } from '@angular/common/http';

import { Subscription } from 'rxjs';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { BucketConfigKey } from '@enums/bucket-config-key.enum';

import { S3UploaderQueriesDto, S3UploaderService, S3UploaderResponseDto } from '@rest/aws/s3/uploader/index';

@Component({
	selector: 'upload-file-item',
	templateUrl: './upload-file-item.component.html',
	styleUrls: ['./upload-file-item.scss']
})

export class UploadFileItem implements OnChanges {
	@ViewChild(ModalDirective, {static: true}) modal: ModalDirective;

	@Input() file: File;
	@Input() path: string;
	@Input() bucket: string;
	@Input() validate = false;
	@Output() uploaded: EventEmitter<never> = new EventEmitter();

	private uploadSubscription: Subscription;

	fileInput: File;
	filePath: string;
	errorMessage: string;
	validateErrors = [];
	progressPercentage = 0;
	isCanceledUpload = false;
	isSuccessUpload = false;
	isUploading = false;

	constructor(private s3UploaderService: S3UploaderService) {}

	ngOnChanges(changes: SimpleChanges) {
		if(changes['file']) {
			this.fileInput = changes['file'].currentValue;
			this.upload();
		}
	}

	upload() {
		const formData = new FormData();
		formData.append('file', this.fileInput);

		const options = new S3UploaderQueriesDto({
			formData: formData,
			key: this.path + encodeURIComponent(this.fileInput.name),
			bucket: this.bucket,
			url: 'upload',
			autoUpload: true,
			enableValidate: this.validate,
			bucketConfigKey: this.validate ? BucketConfigKey.VALIDATE : null
		});

		this.filePath = `${this.bucket}/${this.path}`;
		this.isUploading = true;

		this.uploadSubscription = this.s3UploaderService
			.upload(options)
			.subscribe(event => {
				if(event.type === HttpEventType.UploadProgress) {
					this.progressPercentage = Math.floor( event.loaded * 100 / event.total );
				}

				if(event.type === HttpEventType.Response) {
					this.handleResponse(event.body);
					this.isUploading = false;
				}
			}, errorResp => {
				this.errorMessage = errorResp.error.message;
				this.remove();
			});
	}

	openModal() {
		this.modal.show();
	}

	remove() {
		this.uploadSubscription.unsubscribe();
		this.progressPercentage = 0;
		this.isCanceledUpload = true;
		this.isUploading = false;
	}

	private handleResponse(resp: S3UploaderResponseDto) {
		if(resp.validate && resp.validate.status !== 'success') {
			this.validate = false;
			this.validateErrors = resp.validate.data;
			this.remove();
			return;
		}

		this.isSuccessUpload = true;
		this.uploaded.emit();
	}
}
