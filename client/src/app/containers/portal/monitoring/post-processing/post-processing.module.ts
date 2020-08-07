import { NgModule } from '@angular/core';

import { SharedModule } from '@components/shared/shared.module';

import { MonitoringPostProcessingComponent } from './post-processing.component';
import { MonitoringPostProcessingRoutingModule } from './post-processing-routing.module';

@NgModule({
	imports: [
		SharedModule,

		MonitoringPostProcessingRoutingModule
	],
	declarations: [
		MonitoringPostProcessingComponent
	],
	exports: [
		MonitoringPostProcessingComponent
	]
})

export class MonitoringPostProcessingModule {}
