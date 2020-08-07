import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SharedModule } from '@components/shared/shared.module';
import { CkEditorModule } from '@components/ui/ckeditor/ckeditor.module';

import { PipelineInfoMonitoringDetailsComponent } from './monitoring-details.component';

@NgModule({
	imports: [
		ReactiveFormsModule,
		FormsModule,
		SharedModule,

		CkEditorModule
	],
	declarations: [
		PipelineInfoMonitoringDetailsComponent
	],
	exports: [
		PipelineInfoMonitoringDetailsComponent
	],
	providers: []
})

export class PipelineInfoMonitoringDetailsModule {}
