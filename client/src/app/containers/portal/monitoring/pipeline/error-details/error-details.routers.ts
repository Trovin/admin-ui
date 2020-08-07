import { Routes } from '@angular/router';

import { MonitoringPipelineErrorDetailsComponent } from './error-details.component';

export const monitoringPipelineErrorDetailsRoutes: Routes = [
	{
		path: ':process/errors-details',
		component: MonitoringPipelineErrorDetailsComponent
	}
];
