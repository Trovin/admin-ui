import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';

import { FormMessageModule } from '@components/ui/form-message/form-message.module';
import { DropdownItemPickerModule } from '@components/ui/dropdown-item-picker/dropdown-item-picker.module';

import { DidixOperationsUpdateProductOrchestrationCreateModalComponent } from './create-modal.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ModalModule.forRoot(),
		DropdownItemPickerModule,

		FormMessageModule
	],
	declarations: [
		DidixOperationsUpdateProductOrchestrationCreateModalComponent
	],
	exports: [
		DidixOperationsUpdateProductOrchestrationCreateModalComponent
	],
	entryComponents: [
		DidixOperationsUpdateProductOrchestrationCreateModalComponent
	]
})

export class DidixOperationsUpdateProductOrchestrationCreateModalModule {}
