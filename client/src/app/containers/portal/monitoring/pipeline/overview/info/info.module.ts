import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@components/shared/shared.module';

import { PipelineInfoProcessModule } from './process/process.module';
import { PipelineInfoMonitoringDetailsModule } from './monitoring-details/monitoring-details.module';

import { PipelineInfoComponent } from './info.component';

@NgModule({
	imports: [
		FormsModule,
		RouterModule,
		SharedModule,

		PipelineInfoProcessModule,
		PipelineInfoMonitoringDetailsModule
	],
	declarations: [
		PipelineInfoComponent
	],
	exports: [
		PipelineInfoComponent
	],
	providers: []
})

export class PipelineInfoModule {}
