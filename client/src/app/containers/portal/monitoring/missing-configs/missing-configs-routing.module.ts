import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { MonitoringMissingConfigsComponent } from './missing-configs.component';

export const routes: Routes = [
	{
		path: '',
		component: MonitoringMissingConfigsComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.MISSING_CONFIGS)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class MonitoringMissingConfigsRoutingModule {}
