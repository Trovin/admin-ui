import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { monitoringStatsTabsRoutes } from './tabs/tabs.routers';

import { MonitoringStatsComponent } from './statistics.component';

export const routes: Routes = [
	{
		path: '',
		component: MonitoringStatsComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.PIPELINES),
		children: [
			...monitoringStatsTabsRoutes
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class MonitoringStatsRoutingModule {}
