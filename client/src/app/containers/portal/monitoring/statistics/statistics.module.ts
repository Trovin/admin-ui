import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@components/shared/shared.module';

import { MonitoringStatsTabsModule } from './tabs/tabs.module';


import { MonitoringStatsComponent } from './statistics.component';
import { MonitoringStatsRoutingModule } from './statistics-routing.module';

@NgModule({
	imports: [
		SharedModule,
		RouterModule,

		MonitoringStatsTabsModule,

		MonitoringStatsRoutingModule
	],
	declarations: [
		MonitoringStatsComponent
	],
	exports: [
		MonitoringStatsComponent
	]
})

export class MonitoringStatsModule {}
