import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { reconciliationDetailsRoutes } from './details/details.routers';

import { ReconciliationComponent } from './reconciliation.component';

export const routes: Routes = [
	{
		path: '',
		component: ReconciliationComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.DB_TO_DB_RECON),
		children: [
			...reconciliationDetailsRoutes
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class ReconciliationRoutingModule {}
