import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { monitoringPipelineOverviewRoutes } from './overview/overview.routers';
import { monitoringPipelineErrorDetailsRoutes } from './error-details/error-details.routers';
import { monitoringPipelinePendingDetailsRoutes } from './pending-details/pending-details.routers';

import { MonitoringPipelineComponent } from './pipeline.component';


export const routes: Routes = [
	{
		path: '',
		component: MonitoringPipelineComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.PIPELINES),
		children: [
			...monitoringPipelineOverviewRoutes,
			...monitoringPipelineErrorDetailsRoutes,
			...monitoringPipelinePendingDetailsRoutes
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class MonitoringPipelineRoutingModule {}
