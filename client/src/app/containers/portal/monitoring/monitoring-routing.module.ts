import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonitoringComponent } from './monitoring.component';

export const routes: Routes = [
	{
		path: '',
		component: MonitoringComponent,
		children: [
			{
				path: '',
				children: [
					{
						path: 'db-to-db-reconciliation',
						loadChildren: () => import('./reconciliation/reconciliation.module').then(m => m.ReconciliationModule)
					},
					{
						path: 'pipelines',
						loadChildren: () => import('./statistics/statistics.module').then(m => m.MonitoringStatsModule)
					},
					{
						path: 'pipelines/:pipelineAlias/:sourceApplication',
						loadChildren: () => import('./pipeline/pipeline.module').then(m => m.MonitoringPipelineModule)
					},
					{
						path: 'post-processing',
						loadChildren: () => import('./post-processing/post-processing.module').then(m => m.MonitoringPostProcessingModule)
					},
					{
						path: 'redshift-ddl',
						loadChildren: () => import('./redshift-ddl/redshift-ddl.module').then(m => m.MonitoringRedshiftDdlModule)
					},
					{
						path: 'redshift-status',
						loadChildren: () => import('./redshift-status/redshift-status.module').then(m => m.MonitoringRedshiftStatusModule)
					},
					{
						path: 'missing-configurations',
						loadChildren: () => import('./missing-configs/missing-configs.module').then(m => m.MonitoringMissingConfigsModule)
					},
					{
						path: 'not-mapped-fields',
						loadChildren: () => import('./not-mapped-fields/not-mapped-fields.module').then(m => m.NotMappedFieldsModule)
					},
					{
						path: 'redshift-empty-records',
						loadChildren: () => import('./redshift-empty-records/redshift-empty-records.module').then(m => m.RedshiftEmptyRecordsModule)
					},
					{
						path: '',
						redirectTo: 'pipelines',
						pathMatch: 'full'
					}
				]
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class MonitoringRoutingModule {}
