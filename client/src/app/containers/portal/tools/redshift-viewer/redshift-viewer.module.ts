import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TabsModule } from 'ngx-bootstrap/tabs';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { SharedModule } from '@components/shared/shared.module';
import { DropdownItemPickerModule } from '@components/ui/dropdown-item-picker/dropdown-item-picker.module';
import { PipesModule } from './../../../../components/ui/pipes/index';

import { RedshiftViewerConfigService } from '@rest/redshift/viewer/config/index';
import { RedshiftDataTableService } from '@rest/redshift/viewer/data-table/index';

import { RedshiftViewerRoutingModule } from './redshift-viewer-routing.module';
import { RedshiftViewerComponent } from './redshift-viewer.component';
import { DownloadFileItemModule } from './download-file-item/download-file-item.module';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		DropdownItemPickerModule,
		RedshiftViewerRoutingModule,
		DownloadFileItemModule,
		TabsModule.forRoot(),
		PipesModule,
		PageHeaderModule
	],
	declarations: [
		RedshiftViewerComponent
	],
	providers: [
		RedshiftViewerConfigService,
		RedshiftDataTableService
	],
	exports: [
		RedshiftViewerComponent
	]
})

export class RedshiftViewerModule {}
