import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';
import { DateRangeUiModule } from '@containers/shared/date-range-ui/date-range-ui.module';

import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes/pipes.module';

import { MonitoringPipelineOverviewModule } from './overview/overview.module';
import { MonitoringPipelineErrorDetailsModule } from './error-details/error-details.module';
import { MonitoringPendingDetailsEventsModule } from './pending-details/pending-details.module';

import { MonitoringPipelineComponent } from './pipeline.component';
import { MonitoringPipelineRoutingModule } from './pipeline-routing.routers';

@NgModule({
	imports: [
		RouterModule,
		SharedModule,
		PipesModule,

		DateRangeUiModule,
		// PageHeaderModule,

		MonitoringPipelineOverviewModule,
		MonitoringPipelineErrorDetailsModule,
		MonitoringPendingDetailsEventsModule,

		MonitoringPipelineRoutingModule
	],
	declarations: [
		MonitoringPipelineComponent
	],
	exports: [
		MonitoringPipelineComponent
	],
	providers: []
})

export class MonitoringPipelineModule {}
