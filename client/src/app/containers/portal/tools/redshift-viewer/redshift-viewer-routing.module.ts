import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { RedshiftViewerComponent } from './redshift-viewer.component';

export const routes: Routes = [
	{
		path: '',
		component: RedshiftViewerComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.REDSHIFT_VIEWER_TOOL)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class RedshiftViewerRoutingModule {}
