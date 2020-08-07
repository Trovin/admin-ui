import { NgModule } from '@angular/core';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes/pipes.module';

import { MonitoringRedshiftStatusComponent } from './redshift-status.component';
import { MonitoringRedshiftStatusRoutingModule } from './redshift-status-routing.module';

@NgModule({
	imports: [
		SharedModule,
		PipesModule,
		PageHeaderModule,

		MonitoringRedshiftStatusRoutingModule
	],
	declarations: [
		MonitoringRedshiftStatusComponent
	],
	exports: [
		MonitoringRedshiftStatusComponent
	]
})

export class MonitoringRedshiftStatusModule {}
