import { Routes } from '@angular/router';

import { AutoConfFilesComponent } from './files.component';

export const autoConfFilesRoutes: Routes = [
	{
		path: '',
		redirectTo: 'batch',
		pathMatch: 'full'
	},
	{
		path: ':type',
		component: AutoConfFilesComponent
	}
];
