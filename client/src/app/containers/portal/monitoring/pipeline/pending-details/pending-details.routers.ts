import { Routes } from '@angular/router';

import { MonitoringPipelinePendingDetailsComponent } from './pending-details.component';

export const monitoringPipelinePendingDetailsRoutes: Routes = [
	{
		path: ':process/pending-details',
		component: MonitoringPipelinePendingDetailsComponent
	}
];
