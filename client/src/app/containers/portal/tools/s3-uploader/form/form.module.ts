import { NgModule } from '@angular/core';

import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes/pipes.module';

import { DropdownItemPickerModule } from '@components/ui/dropdown-item-picker/dropdown-item-picker.module';

import { FormComponent } from './form.component';

@NgModule({
	imports: [
		SharedModule,
		PipesModule,

		DropdownItemPickerModule
	],
	declarations: [
		FormComponent
	],
	exports: [
		FormComponent
	]
})

export class FormModule {}
