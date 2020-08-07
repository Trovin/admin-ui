import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ToolsComponent } from './tools.component';

export const routes: Routes = [
	{
		path: '',
		component: ToolsComponent
	},
	{
		path: 's3-uploader',
		loadChildren: () => import('./s3-uploader/s3-uploader.module').then(m => m.S3UploaderModule)
	},
	{
		path: 'redshift-viewer',
		loadChildren: () => import('./redshift-viewer/redshift-viewer.module').then(m => m.RedshiftViewerModule)
	},
	{
		path: 'redshift-config-generator',
		loadChildren: () => import('./redshift-config-generator/redshift-config-generator.module').then(m => m.ToolsRedshiftConfigGeneratorModule)
	},
	{
		path: 'redshift-diff-tool',
		loadChildren: () => import('./redshift-diff-tool/redshift-diff-tool.module').then(m => m.RedshiftDiffToolModule)
	},
	{
		path: 'custom-replay-tool',
		loadChildren: () => import('./replay-based-file/replay-based-file.module').then(m => m.ReplayBasedFileModule)
	},
	{
		path: 'didix-operations',
		loadChildren: () => import('./didix-operations/didix-operations.module').then(m => m.DidixOperationsModule)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class ToolsRoutingModule {}
