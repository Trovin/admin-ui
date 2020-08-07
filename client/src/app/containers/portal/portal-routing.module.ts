import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@core/auth/guards/guard.service';
import { PortalComponent } from './portal.component';

export const routes: Routes = [
	{
		path: 'portal',
		component: PortalComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: '',
				children: [
					{
						path: 'audit',
						loadChildren: () => import('./audit/audit.module').then(m => m.AuditModule)
					},
					{
						path: 'monitoring',
						loadChildren: () => import('./monitoring/monitoring.module').then(m => m.MonitoringModule)
					},
					{
						path: 'configs',
						loadChildren: () => import('./configs/configs.module').then(m => m.ConfigsModule)
					},
					{
						path: 'input-files',
						loadChildren: () => import('./batch-data/batch-data.module').then(m => m.BatchDataModule)
					},
					{
						path: 'source-catalog',
						loadChildren: () => import('./source-catalog/source-catalog.module').then(m => m.SourceCatalogModule)
					},
					{
						path: 'config-storage',
						loadChildren: () => import('./source-catalog/config-storage/config-storage.module').then(m => m.ConfigStorageModule)
					},
					{
						path: 'redshift-tables',
						loadChildren: () => import('./source-catalog/redshift-tables/redshift-tables.module').then(m => m.RedshiftTablesModule)
					},
					{
						path: 'dashboard',
						loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
					},
					{
						path: 'tools',
						loadChildren: () => import('./tools/tools.module').then(m => m.ToolsModule)
					},
					{
						path: 'user',
						loadChildren: () => import('./user/user.module').then(m => m.UserModule)
					},
					{
						path: '',
						redirectTo: 'dashboard',
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

export class PortalRoutingModule {}
