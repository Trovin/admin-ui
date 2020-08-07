import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuditComponent } from './audit.component';

export const routes: Routes = [
	{
		path: '',
		component: AuditComponent
	},
	{
		path: '',
		loadChildren: () => import('./dtl-stats/dtl-stats.module').then(m => m.AuditDTLStatsModule)
	},
	{
		path: '',
		loadChildren: () => import('./redshift-data-load-stats/redshift-data-load-stats.module').then(m => m.AuditRedshiftDataLoadStatsModule)
	},
	{
		path: '',
		loadChildren: () => import('./batch/batch.module').then(m => m.AuditBatchModule)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class AuditRoutingModule {}
