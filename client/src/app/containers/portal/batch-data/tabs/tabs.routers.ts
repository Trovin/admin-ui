import { Routes } from '@angular/router';

import { BatchDataTabsComponent } from './tabs.component';

export const batchDataTabsRoutes: Routes = [
	{
		path: '',
		redirectTo: 'real-time',
		pathMatch: 'full'
	},
	{
		path: ':bucket',
		component: BatchDataTabsComponent
	}
];
