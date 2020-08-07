import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { AuditRedshiftDataLoadStatsComponent } from './redshift-data-load-stats.component';

export const routes: Routes = [
	{
		path: 'redshift-data-copy',
		component: AuditRedshiftDataLoadStatsComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.REDSHIFT_DATA)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class AuditRedshiftDataLoadStatsRoutingModule {}
