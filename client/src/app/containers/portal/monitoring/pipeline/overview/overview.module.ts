import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes';

import { DateRangeUiModule } from '@containers/shared/date-range-ui/date-range-ui.module';
import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { PipelineInfoModule } from './info/info.module';

import { MonitoringPipelineOverviewComponent } from './overview.component';

@NgModule({
	imports: [
		FormsModule,
		RouterModule,
		SharedModule,
		PipesModule,

		DateRangeUiModule,
		PageHeaderModule,

		PipelineInfoModule
	],
	declarations: [
		MonitoringPipelineOverviewComponent
	],
	exports: [
		MonitoringPipelineOverviewComponent
	]
})

export class MonitoringPipelineOverviewModule {}
