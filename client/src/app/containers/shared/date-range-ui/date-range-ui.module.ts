import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes/pipes.module';

import { DateRangeUiComponent } from './date-range-ui.component';

@NgModule({
	imports: [
		RouterModule,
		SharedModule,
		PipesModule
	],
	declarations: [
		DateRangeUiComponent
	],
	exports: [
		DateRangeUiComponent
	],
	providers: []
})

export class DateRangeUiModule {}
