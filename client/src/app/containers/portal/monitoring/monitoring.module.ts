import { NgModule } from '@angular/core';

import { SharedModule } from '@components/shared/shared.module';

import { ParamsService } from '@containers/shared/params.service';

import { MonitoringComponent } from './monitoring.component';
import { MonitoringRoutingModule } from './monitoring-routing.module';

@NgModule({
	imports: [
		SharedModule,

		MonitoringRoutingModule
	],
	declarations: [
		MonitoringComponent
	],
	exports: [
		MonitoringComponent
	],
	providers: [
		ParamsService
	]
})

export class MonitoringModule {}
