import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

export const routes: Routes = [
	{
		path: '',
		component: DashboardComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.DASHBOARD)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class DashboardRoutingModule {}
