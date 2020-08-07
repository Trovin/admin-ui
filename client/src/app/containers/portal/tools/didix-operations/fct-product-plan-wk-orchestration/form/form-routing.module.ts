import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';

import { DidixOperationsFctProductPlanWkOrchestrationFormComponent } from './form.component';

export const routes: Routes = [
	{
		path: '',
		component: DidixOperationsFctProductPlanWkOrchestrationFormComponent,
		canActivate: [PermissionsGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DidixOperationsFctProductPlanWkOrchestrationFormRoutingModule {}
