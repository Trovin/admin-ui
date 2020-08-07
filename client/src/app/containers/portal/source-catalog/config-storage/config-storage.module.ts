import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@components/shared/shared.module';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { ConfigStorageComponent } from './config-storage.component';

import { DetailsModule } from './details/details.module';

import { ConfigStorageModalModule } from './modals/generate-config/generate-config.module';

import { ConfigStorageRoutingModule } from './config-storage-routing.module';

@NgModule({
	imports: [
		SharedModule,
		PageHeaderModule,
		FormsModule,
		DetailsModule,
		ConfigStorageModalModule,

		ConfigStorageRoutingModule
	],
	declarations: [
		ConfigStorageComponent
	],
	exports: [
		ConfigStorageComponent
	]
})

export class ConfigStorageModule {}
