import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { batchDataTabsRoutes } from './tabs/tabs.routers';
import { batchDataMissingEventsRoutes } from './missing-events/missing-events.routers';

import { BatchDataComponent } from './batch-data.component';

export const routes: Routes = [
	{
		path: '',
		component: BatchDataComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.INPUT_FILES),
		children: [
			...batchDataTabsRoutes,
			...batchDataMissingEventsRoutes
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class BatchDataRoutingModule {}
