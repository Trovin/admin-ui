import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { PaginatorV2Module } from '@components/ui/paginator-v2/paginator.module';
import { FormMessageModule } from '@components/ui/form-message/form-message.module';
import { DropdownItemPickerModule } from '@components/ui/dropdown-item-picker/dropdown-item-picker.module';

import { DidixOperationsCreateManualTxnOrchestrationModalComponent } from './create-modal.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		FormMessageModule,
		PaginatorV2Module,
		ModalModule.forRoot(),
		DropdownItemPickerModule,
		BsDatepickerModule.forRoot(),

		FormMessageModule
	],
	declarations: [
		DidixOperationsCreateManualTxnOrchestrationModalComponent
	],
	exports: [
		DidixOperationsCreateManualTxnOrchestrationModalComponent
	],
	entryComponents: [
		DidixOperationsCreateManualTxnOrchestrationModalComponent
	]
})

export class DidixOperationsCreateManualTxnOrchestrationModalModule {}
