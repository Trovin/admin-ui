import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes';

import { DateRangeUiModule } from '@containers/shared/date-range-ui/date-range-ui.module';
import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { MonitoringPipelineErrorDetailsComponent } from './error-details.component';

@NgModule({
	imports: [
		SharedModule,
		RouterModule,
		PipesModule,

		DateRangeUiModule,
		PageHeaderModule
	],
	declarations: [
		MonitoringPipelineErrorDetailsComponent
	],
	exports: [
		MonitoringPipelineErrorDetailsComponent
	],
	providers: []
})

export class MonitoringPipelineErrorDetailsModule {}
