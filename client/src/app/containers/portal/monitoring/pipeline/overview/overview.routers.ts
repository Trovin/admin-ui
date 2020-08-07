import { Routes } from '@angular/router';

import { pipelineInfoRoutes } from './info/info.routers';

import { MonitoringPipelineOverviewComponent } from './overview.component';

export const monitoringPipelineOverviewRoutes: Routes = [
	{
		path: '',
		component: MonitoringPipelineOverviewComponent,
		children: [
			...pipelineInfoRoutes
		]
	}
];
