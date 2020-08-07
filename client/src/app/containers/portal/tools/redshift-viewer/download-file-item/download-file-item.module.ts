import { NgModule } from '@angular/core';
import { SharedModule } from '@components/shared/shared.module';

import { PipesModule } from './../../../../../components/ui/pipes/index';

import { RedshiftDataTableService } from '@rest/redshift/viewer/data-table/index';
import { S3DownloadService } from '@rest/aws/s3/download/index';

import { DownloadFileItemComponent } from './download-file-item.component';

@NgModule({
	imports: [
		SharedModule,
		PipesModule
	],
	declarations: [
		DownloadFileItemComponent
	],
	providers: [
		RedshiftDataTableService,
		S3DownloadService
	],
	exports: [
		DownloadFileItemComponent
	]
})

export class DownloadFileItemModule {}
