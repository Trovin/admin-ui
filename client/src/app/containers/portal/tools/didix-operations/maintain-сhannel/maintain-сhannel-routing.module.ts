import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';

import { Containers } from '@config/containers.enum';

import { DidixOperationsMaintainChannelComponent } from './maintain-сhannel.component';

export const routes: Routes = [
	{
		path: '',
		component: DidixOperationsMaintainChannelComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.DIDIX_OPERATIONS)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DidixOperationsMaintainChannelRoutingModule {}
