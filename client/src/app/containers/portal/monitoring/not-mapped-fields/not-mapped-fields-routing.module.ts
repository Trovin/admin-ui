import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { NotMappedFieldsComponent } from './not-mapped-fields.component';

export const routes: Routes = [
	{
		path: '',
		component: NotMappedFieldsComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.UNKNOWN_FIELDS),
		children: []
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class NotMappedFieldsRoutingModule {}
