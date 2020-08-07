import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { DidixOperationsMaintainArticleComponent } from './maintain-article.component';

export const routes: Routes = [
	{
		path: '',
		component: DidixOperationsMaintainArticleComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.DIDIX_OPERATIONS),
		children: [
			{
				path: '',
				loadChildren: () => import('./form/form.module').then(m => m.DidixOperationsMaintainArticlesFormModule)
			},
			{
				path: 'update',
				loadChildren: () => import('./form/update/update.module').then(m => m.DidixOperationsMaintainArticlesFormUpdateModule)
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DidixOperationsMaintainArticleRoutingModule {}
