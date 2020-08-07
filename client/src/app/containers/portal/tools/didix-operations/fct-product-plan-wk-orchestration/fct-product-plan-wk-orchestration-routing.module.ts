import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';

import { Containers } from '@config/containers.enum';

import { DidixOperationsFctProductPlanWKOrchestrationComponent } from './fct-product-plan-wk-orchestration.component';

export const routes: Routes = [
	{
		path: '',
		component: DidixOperationsFctProductPlanWKOrchestrationComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.DIDIX_OPERATIONS),
		children: [
			{
				path: '',
				loadChildren: () => import('./form/form.module').then(m => m.DidixOperationsMaintainPlanningFormModule)
			},
			{
				path: 'update',
				loadChildren: () => import('./form/update/update.module').then(m => m.DidixOperationsFctProductPlanWkOrchestrationFormUpdateModule)
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DidixOperationsFctProductPlanWkOrchestrationRoutingModule {}
