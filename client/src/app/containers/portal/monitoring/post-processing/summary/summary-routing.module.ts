import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonitoringPostProcessingSummaryComponent } from './summary.component';

export const routes: Routes = [
	{
		path: '',
		component: MonitoringPostProcessingSummaryComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class MonitoringPostProcessingSummaryRoutingModule {}
