import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { PipesModule } from '@components/ui/pipes';
import { SharedModule } from '@components/shared/shared.module';

import { MonitoringPostProcessingSummaryFormModule } from './form/form.module';

import { MonitoringPostProcessingSummaryComponent } from './summary.component';
import { MonitoringPostProcessingSummaryRoutingModule } from './summary-routing.module';

@NgModule({
	imports: [
		SharedModule,
		RouterModule,
		PipesModule,
		TooltipModule.forRoot(),
		PageHeaderModule,

		MonitoringPostProcessingSummaryFormModule,

		MonitoringPostProcessingSummaryRoutingModule
	],
	declarations: [
		MonitoringPostProcessingSummaryComponent
	],
	exports: [
		MonitoringPostProcessingSummaryComponent
	]
})

export class MonitoringPostProcessingSummaryModule {}
