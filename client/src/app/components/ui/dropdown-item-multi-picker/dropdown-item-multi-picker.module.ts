import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@components/shared/shared.module';

import { DropdownItemMultiPickerComponent } from './dropdown-item-multi-picker.component';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		ReactiveFormsModule
	],
	declarations: [
		DropdownItemMultiPickerComponent
	],
	exports: [
		DropdownItemMultiPickerComponent
	]
})

export class DropdownItemMultiPickerModule {}