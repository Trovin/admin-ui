import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';
import { DropdownItemPickerModule } from '@components/ui/dropdown-item-picker/dropdown-item-picker.module';

import { ExecuteModalComponent } from './execute-modal.component';

@NgModule({
	imports: [
		CommonModule,
		DropdownItemPickerModule,
		ModalModule.forRoot()
	],
	declarations: [
		ExecuteModalComponent
	],
	exports: [
		ExecuteModalComponent
	],
	entryComponents: [
		ExecuteModalComponent
	]
})

export class ExecuteModalModule {}
