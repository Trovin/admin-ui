import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { AuditBatchComponent } from './batch.component';

export const routes: Routes = [
	{
		path: 'batch',
		component: AuditBatchComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.BATCH_DATA)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class AuditBatchRoutingModule {}
