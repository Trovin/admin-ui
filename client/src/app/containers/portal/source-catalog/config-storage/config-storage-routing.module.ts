import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { ConfigStorageComponent } from './config-storage.component';

export const routes: Routes = [
	{
		path: '',
		component: ConfigStorageComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.SOURCE_CATALOG)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ConfigStorageRoutingModule {}
