import { Routes } from '@angular/router';

import { PipelineInfoComponent } from './info.component';

export const pipelineInfoRoutes: Routes = [
	{
		path: ':process',
		component: PipelineInfoComponent
	}
];
