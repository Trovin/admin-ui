import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { RedshiftEmptyRecordsComponent } from './redshift-empty-records.component';

export const routes: Routes = [
	{
		path: '',
		component: RedshiftEmptyRecordsComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.DATAMARTS_EMPTY_RECORDS),
		children: []
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class RedshiftEmptyRecordsRoutingModule {}
