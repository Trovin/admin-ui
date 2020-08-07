import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { MonitoringRedshiftDdlComponent } from './redshift-ddl.component';

export const routes: Routes = [
	{
		path: '',
		component: MonitoringRedshiftDdlComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.REDSHIFT_DDL)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class MonitoringRedshiftDdlRoutingModule {}
