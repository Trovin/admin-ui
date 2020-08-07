import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { ReplayBasedFileComponent } from './replay-based-file.component';

export const routes: Routes = [
	{
		path: '',
		component: ReplayBasedFileComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.CUSTOM_REPLAY_TOOL)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class ReplayBasedFileRoutingModule {}
