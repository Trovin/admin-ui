import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@components/shared/shared.module';
import { ChartModule } from '@components/ui/chart/chart.module';
import { PipesModule } from '@components/ui/pipes';

import { CloudWatchWidgetFormModule } from './../shared/form/form.module';

import { CloudWatchMetricDataWidgetComponent } from './metric-data.component';

@NgModule({
	imports: [
		RouterModule,
		SharedModule,
		PipesModule,

		ChartModule,

		CloudWatchWidgetFormModule
	],
	declarations: [
		CloudWatchMetricDataWidgetComponent
	],
	exports: [
		CloudWatchMetricDataWidgetComponent
	]
})

export class CloudWatchMetricDataWidgetModule {}
