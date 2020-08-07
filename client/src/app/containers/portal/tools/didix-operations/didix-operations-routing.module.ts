import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { DidixOperationsComponent } from './didix-operations.component';

export const routes: Routes = [
	{
		path: '',
		component: DidixOperationsComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.DIDIX_OPERATIONS),
		children: [
			{
				path: '',
				loadChildren: () => import('./list/list.module').then(m => m.DidixOperationsListModule)
			},
			{
				path: 'manual-redemptions',
				loadChildren: () => import('./create-manual-txn-orchestration/create-manual-txn-orchestration.module').then(m => m.DidixOperationsCreateManualTxnOrchestrationModule)
			},
			{
				path: 'manual-sales',
				loadChildren: () => import('./create-manual-card-orchestration/create-manual-card-orchestration.module').then(m => m.DidixOperationsCreateManualCardOrchestrationModule)
			},
			{
				path: 'maintain-products',
				loadChildren: () => import('./update-product-orchestration/update-product-orchestration.module').then(m => m.DidixOperationssUpdateProductOrchestrationModule)
			},
			{
				path: 'maintain-planning',
				loadChildren: () => import('./fct-product-plan-wk-orchestration/fct-product-plan-wk-orchestration.module').then(m => m.DidixOperationsFctProductPlanWkOrchestrationModule)
			},
			{
				path: 'maintain-channel',
				loadChildren: () => import('./maintain-сhannel/maintain-сhannel.module').then(m => m.DidixOperationsMaintainChannelModule)
			},
			{
				path: 'maintain-stores',
				loadChildren: () => import('./maintain-stores/maintain-stores.module').then(m => m.DidixOperationsMaintainStoresModule)
			},
			{
				path: 'maintain-articles',
				loadChildren: () => import('./maintain-article/maintain-article.module').then(m => m.DidixOperationsMaintainArticleModule)
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DidixOperationsRoutingModule {}
