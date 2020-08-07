import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { AuditDTLStatsComponent } from './dtl-stats.component';

export const routes: Routes = [
	{
		path: 'data-transfer',
		component: AuditDTLStatsComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.TRANSFER_DATA)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class AuditDTLStatsRoutingModule {}
