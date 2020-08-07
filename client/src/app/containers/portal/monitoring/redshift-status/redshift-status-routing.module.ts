import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { MonitoringRedshiftStatusComponent } from './redshift-status.component';

export const routes: Routes = [
	{
		path: '',
		component: MonitoringRedshiftStatusComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.REDSHIFT_STATUS)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class MonitoringRedshiftStatusRoutingModule {}
