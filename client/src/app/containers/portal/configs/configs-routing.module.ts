import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigsComponent } from './configs.component';

export const routes: Routes = [
	{
		path: '',
		component: ConfigsComponent
	},
	{
		path: '',
		loadChildren: () => import('./alarms/alarm-configs.module').then(m => m.AlarmConfigModule)
	},
	{
		path: '',
		loadChildren: () => import('./pipelines/pipelines-configs.module').then(m => m.PipelinesConfigsModule)
	}

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class ConfigsRoutingModule {}
