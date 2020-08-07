import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { ToolsRedshiftConfigGeneratorComponent } from './redshift-config-generator.component';

export const routes: Routes = [
	{
		path: '',
		component: ToolsRedshiftConfigGeneratorComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.REDSHIFT_CONFIG_TOOL)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class ToolsRedshiftConfigGeneratorRoutingModule {}
