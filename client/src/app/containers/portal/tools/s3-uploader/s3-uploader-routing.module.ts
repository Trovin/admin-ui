import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermissionsGuard } from '@core/auth/guards/permissions-guard.service';
import { Containers } from '@config/containers.enum';

import { S3UploaderComponent } from './s3-uploader.component';

export const routes: Routes = [
	{
		path: '',
		component: S3UploaderComponent,
		canActivate: [PermissionsGuard],
		data: Containers.getValues(Containers.S3_UPLOADER_TOOL)
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})

export class S3UploaderRoutingModule {}
