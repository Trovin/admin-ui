import { Routes } from '@angular/router';

import { autoConfFilesRoutes } from './../files/files.routers';

import { AutoConfTabsComponent } from './tabs.component';

export const autoConfTabsRoutes: Routes = [
	{
		path: '',
		component: AutoConfTabsComponent,
		children: [
			...autoConfFilesRoutes
		]
	}
];
