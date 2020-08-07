import { NgModule } from '@angular/core';

import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes/pipes.module';

import { LineChartModule } from '@swimlane/ngx-charts';

import { NGXLineChartComponent } from './chart.component';

@NgModule({
	imports: [
		SharedModule,
		PipesModule,
		LineChartModule
	],
	declarations: [
		NGXLineChartComponent
	],
	exports: [
		NGXLineChartComponent
	]
})
export class NGXLineChartModule {}
