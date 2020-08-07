import { NgModule } from '@angular/core';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { SharedModule } from '@components/shared/shared.module';

import { AlarmsWidgetModule } from './widgets/alarms-widget/alarms-widget.module';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CloudWatchMetricDataWidgetModule } from './widgets/cloud-watch/metric-data/metric-data.module';
import { CloudWatchWidgeImageModule } from './widgets/cloud-watch/widget-image/widget-image.module';

@NgModule({
	imports: [
		SharedModule,

		DashboardRoutingModule,

		PageHeaderModule,
		CloudWatchMetricDataWidgetModule,
		CloudWatchWidgeImageModule,

		AlarmsWidgetModule
	],
	declarations: [
		DashboardComponent
	],
	exports: [
		DashboardComponent
	]
})

export class DashboardModule {}
