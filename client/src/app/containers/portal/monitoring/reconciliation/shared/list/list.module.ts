import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@components/shared/shared.module';

import { ReconciliationSourceApplicationsComponent } from './list.component';

@NgModule({
	imports: [
		RouterModule,
		SharedModule
	],
	declarations: [
		ReconciliationSourceApplicationsComponent
	],
	exports: [
		ReconciliationSourceApplicationsComponent
	],
	providers: []
})

export class ReconciliationSourceApplicationsModule {}
