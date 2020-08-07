import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { SourceCatalogComponent } from './source-catalog.component';

export const routes: Routes = [
	{
		path: '',
		component: SourceCatalogComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.SOURCE_CATALOG),
		children: [
			// {
			// 	path: 'config-storage',
			// 	loadChildren: () => import('./config-storage/config-storage.module').then(m => m.ConfigStorageModule)
			// }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SourceCatalogRoutingModule {}
