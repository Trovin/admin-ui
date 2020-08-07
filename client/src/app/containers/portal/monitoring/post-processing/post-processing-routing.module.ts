import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { MonitoringPostProcessingComponent } from './post-processing.component';

export const routes: Routes = [
	{
		path: '',
		component: MonitoringPostProcessingComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.POST_PROCESSING),
		children: [
			{
				path: '',
				redirectTo: 'summary',
				pathMatch: 'full'
			},
			{
				path: 'summary',
				loadChildren: () => import('./summary/summary.module').then(m => m.MonitoringPostProcessingSummaryModule)
			},
			{
				path: 'summary/errors',
				loadChildren: () => import('./errors/errors.module').then(m => m.MonitoringPostProcessingErrorsModule)
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class MonitoringPostProcessingRoutingModule {}
