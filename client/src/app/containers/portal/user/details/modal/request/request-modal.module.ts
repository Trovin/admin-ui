import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';
import { DropdownItemMultiPickerModule } from '@components/ui/dropdown-item-multi-picker/dropdown-item-multi-picker.module';

import { RequestPermissionComponent } from './request-modal.component';

@NgModule({
	imports: [
		CommonModule,
		ModalModule.forRoot(),
		FormsModule,
		ReactiveFormsModule,
		DropdownItemMultiPickerModule
	],
	declarations: [
		RequestPermissionComponent
	],
	exports: [
		RequestPermissionComponent
	],
	entryComponents: [
		RequestPermissionComponent
	]
})

export class RequestPermissionModalModule {}
