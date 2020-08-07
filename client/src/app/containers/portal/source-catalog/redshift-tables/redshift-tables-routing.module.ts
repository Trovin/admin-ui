import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { RedshiftTablesComponent } from './redshift-tables.component';

export const routes: Routes = [
	{
		path: '',
		component: RedshiftTablesComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.SOURCE_CATALOG)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class RedshiftTablesRoutingModule {}
