import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { AlarmConfigComponent } from './alarm-configs.component';

export const routes: Routes = [
	{
		path: 'alarms',
		component: AlarmConfigComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.S3_ALARMS_CONFIGS)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class AlarmConfigRoutingModule {}
