import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';
import { DropdownItemPickerModule } from '@components/ui/dropdown-item-picker/dropdown-item-picker.module';

import { ActionModalComponent } from './action-modal.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		DropdownItemPickerModule,
		CollapseModule.forRoot(),
		ModalModule.forRoot()
	],
	declarations: [
		ActionModalComponent
	],
	exports: [
		ActionModalComponent
	],
	entryComponents: [
		ActionModalComponent
	]
})

export class ActionModalModule {}
