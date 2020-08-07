import { Routes } from '@angular/router';

import { MonitoringStatsTabsComponent } from './tabs.component';

export const monitoringStatsTabsRoutes: Routes = [
	{
		path: '',
		redirectTo: 'real-time',
		pathMatch: 'full'
	},
	{
		path: ':pipelineAlias',
		component: MonitoringStatsTabsComponent
	}
];
