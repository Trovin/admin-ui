import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';

import { DidixOperationsMaintainArticlesFormUpdateComponent } from './update.component';

export const routes: Routes = [
	{
		path: '',
		component: DidixOperationsMaintainArticlesFormUpdateComponent,
		canActivate: [PermissionsGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DidixOperationsMaintainArticlesFormUpdateRoutingModule {}
