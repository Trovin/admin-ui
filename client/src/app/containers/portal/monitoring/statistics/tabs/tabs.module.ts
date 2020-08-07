import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { SharedModule } from '@components/shared/shared.module';

import { MonitoringStatsListModule } from './list/list.module';
import { MonitoringStatsFormModule } from './form/form.module';

import { MonitoringStatsTabsComponent } from './tabs.component';

@NgModule({
	imports: [
		SharedModule,
		RouterModule,
		PageHeaderModule,

		MonitoringStatsListModule,
		MonitoringStatsFormModule
	],
	declarations: [
		MonitoringStatsTabsComponent
	],
	exports: [
		MonitoringStatsTabsComponent
	]
})
export class MonitoringStatsTabsModule {}
