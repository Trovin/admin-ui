import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { RedshiftDiffToolComponent } from './redshift-diff-tool.component';

export const routes: Routes = [
	{
		path: '',
		component: RedshiftDiffToolComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.REDSHIFT_DDL_DIFF_TOOL),
		children: []
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class RedshiftDiffToolRoutingModule {}
