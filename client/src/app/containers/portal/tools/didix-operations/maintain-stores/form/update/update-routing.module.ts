import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';

import { DidixOperationsMaintainStoresFormUpdateComponent } from './update.component';

export const routes: Routes = [
	{
		path: '',
		component: DidixOperationsMaintainStoresFormUpdateComponent,
		canActivate: [PermissionsGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DidixOperationsMaintainStoressFormUpdateRoutingModule {}
