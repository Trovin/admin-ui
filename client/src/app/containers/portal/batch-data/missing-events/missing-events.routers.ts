import { Routes } from '@angular/router';

import { BatchDataMissingEventsComponent } from './missing-events.component';

export const batchDataMissingEventsRoutes: Routes = [
	{
		path: ':bucket/missing-events',
		component: BatchDataMissingEventsComponent
	}
];
