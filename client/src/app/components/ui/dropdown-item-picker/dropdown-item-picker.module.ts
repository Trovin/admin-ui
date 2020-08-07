import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { SharedModule } from '@components/shared/shared.module';

import { DropdownItemPickerComponent } from './dropdown-item-picker.component';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		ReactiveFormsModule,

		ScrollingModule
	],
	declarations: [
		DropdownItemPickerComponent
	],
	exports: [
		DropdownItemPickerComponent
	]
})

export class DropdownItemPickerModule {}
