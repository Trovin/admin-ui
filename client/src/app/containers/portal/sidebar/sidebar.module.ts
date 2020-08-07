import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@components/shared/shared.module';

import { SidebarComponent } from './sidebar.component';

@NgModule({
	imports: [
		RouterModule,
		SharedModule
	],
	declarations: [
		SidebarComponent
	],
	exports: [
		SidebarComponent
	]
})

export class SidebarModule {}
