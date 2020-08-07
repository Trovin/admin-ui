import { NgModule } from '@angular/core';

import { PaginatorModule } from '@components/ui/paginator/paginator.module';
import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { MonitoringPipelinePendingDetailsComponent } from './pending-details.component';

@NgModule({
	imports: [
		SharedModule,
		PipesModule,
		PageHeaderModule,

		PaginatorModule
	],
	declarations: [
		MonitoringPipelinePendingDetailsComponent
	],
	exports: [
		MonitoringPipelinePendingDetailsComponent
	],
	providers: []
})

export class MonitoringPendingDetailsEventsModule {}
