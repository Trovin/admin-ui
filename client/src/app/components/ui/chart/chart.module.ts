import { NgModule } from '@angular/core';

import { SharedModule } from '@components/shared/shared.module';
import { ChartComponent } from './chart.component';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		ChartComponent
	],
	exports: [
		ChartComponent
	]
})
export class ChartModule {}