import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonitoringPostProcessingErrorsComponent } from './errors.component';

export const routes: Routes = [
	{
		path: '',
		component: MonitoringPostProcessingErrorsComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class MonitoringPostProcessingErrorsRoutingModule {}
