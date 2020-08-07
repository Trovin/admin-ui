import { NgModule } from '@angular/core';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { ModalModule } from 'ngx-bootstrap/modal';
import { PipesModule } from '@components/ui/pipes/';
import { SharedModule } from '@components/shared/shared.module';
import { DropdownItemPickerModule } from '@components/ui/dropdown-item-picker/dropdown-item-picker.module';

import { S3UploaderRoutingModule } from './s3-uploader-routing.module';
import { S3UploaderComponent } from './s3-uploader.component';

import { UploadModule } from './upload/upload.module';
import { FilesListModule } from './files/files.module';
import { FormModule } from './form/form.module';

@NgModule({
	imports: [
		SharedModule,
		DropdownItemPickerModule,
		S3UploaderRoutingModule,
		ModalModule.forRoot(),

		PageHeaderModule,
		PipesModule,

		UploadModule,
		FilesListModule,
		FormModule
	],
	declarations: [
		S3UploaderComponent
	],
	exports: [
		S3UploaderComponent
	]
})

export class S3UploaderModule {}
