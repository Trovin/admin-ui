import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { SharedModule } from '@components/shared/shared.module';

import { AutoConfFilesModule } from './../files/files.module';

import { AutoConfTabsComponent } from './tabs.component';

@NgModule({
	imports: [
		SharedModule,
		RouterModule,

		PageHeaderModule,

		AutoConfFilesModule
	],
	declarations: [
		AutoConfTabsComponent
	],
	exports: [
		AutoConfTabsComponent
	]
})

export class AutoConfTabsModule {}
