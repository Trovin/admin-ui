import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes/pipes.module';

import { DropdownItemPickerModule } from '@components/ui/dropdown-item-picker/dropdown-item-picker.module';

import { AlarmConfigFormComponent } from './form.component';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		PipesModule,
		ReactiveFormsModule,

		DropdownItemPickerModule
	],
	declarations: [
		AlarmConfigFormComponent
	],
	exports: [
		AlarmConfigFormComponent
	]
})

export class AlarmConfigFormModule {}
