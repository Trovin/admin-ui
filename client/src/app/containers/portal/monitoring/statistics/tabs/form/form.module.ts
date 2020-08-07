import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DateRangeUiModule } from '@containers/shared/date-range-ui/date-range-ui.module';

import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes/pipes.module';
import { DateRangeModule } from '@components/ui/date-range/date-range.module';
import { DropdownItemPickerModule } from '@components/ui/dropdown-item-picker/dropdown-item-picker.module';

import { MonitoringStatsFormComponent } from './form.component';

@NgModule({
	imports: [
		SharedModule,
		PipesModule,
		FormsModule,
		ReactiveFormsModule,

		DropdownItemPickerModule,
		DateRangeUiModule,

		DateRangeModule
	],
	declarations: [
		MonitoringStatsFormComponent
	],
	exports: [
		MonitoringStatsFormComponent
	]
})

export class MonitoringStatsFormModule {}