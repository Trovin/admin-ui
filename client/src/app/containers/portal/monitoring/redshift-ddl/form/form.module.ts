import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes/pipes.module';

import { DateRangeModule } from '@components/ui/date-range/date-range.module';
import { DropdownItemPickerModule } from '@components/ui/dropdown-item-picker/dropdown-item-picker.module';

import { DateRangeUiModule } from '@containers/shared/date-range-ui/date-range-ui.module';

import { MonitoringRedshiftDdlFormComponent } from './form.component';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		PipesModule,
		ReactiveFormsModule,

		DateRangeUiModule,
		DateRangeModule,
		DropdownItemPickerModule
	],
	declarations: [
		MonitoringRedshiftDdlFormComponent
	],
	exports: [
		MonitoringRedshiftDdlFormComponent
	]
})

export class MonitoringRedshiftDdlFormModule {}
