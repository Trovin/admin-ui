import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { autoConfTabsRoutes } from './tabs/tabs.routers';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { PipelinesConfigsComponent } from './pipelines-configs.component';

export const routes: Routes = [
	{
		path: 'pipelines',
		component: PipelinesConfigsComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.PIPELINES_CONFIGS),
		children: [
			...autoConfTabsRoutes
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class PipelinesConfigsRoutingModule {}
