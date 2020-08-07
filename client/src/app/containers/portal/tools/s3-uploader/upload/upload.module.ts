import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PipesModule } from '@components/ui/pipes/index';
import { ModalModule } from 'ngx-bootstrap/modal';

import { UploadFileItem } from './upload-files/upload-file-item/upload-file-item.component';
import { UploadFiles } from './upload-files/upload-files.component';
import { UploadFileInputDirective } from './upload-file-input.directive';
import { UploadDragAndDropDirective } from './upload-drag-and-drop.directive';

import { S3UploaderService } from '@rest/aws/s3/uploader/upload-file.service';
import { FileValidateService } from './../shared/validate/file-validate.service';

@NgModule({
	imports: [
		CommonModule,
		PipesModule,
		ModalModule.forRoot()
	],
	declarations: [
		UploadFileInputDirective,
		UploadDragAndDropDirective,
		UploadFileItem,
		UploadFiles
	],
	providers: [
		S3UploaderService,
		FileValidateService
	],
	exports: [
		UploadFileInputDirective,
		UploadDragAndDropDirective,
		UploadFileItem,
		UploadFiles
	]
})

export class UploadModule { }
