import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';

import { FormMessageModule } from '@components/ui/form-message/form-message.module';

import { DidixOperationsFctProductPlanWkOrchestrationFormUpdateModalComponent } from './create-modal.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ModalModule.forRoot(),

		FormMessageModule
	],
	declarations: [
		DidixOperationsFctProductPlanWkOrchestrationFormUpdateModalComponent
	],
	exports: [
		DidixOperationsFctProductPlanWkOrchestrationFormUpdateModalComponent
	],
	entryComponents: [
		DidixOperationsFctProductPlanWkOrchestrationFormUpdateModalComponent
	]
})

export class DidixOperationsFctProductPlanWkOrchestrationFormUpdateModalModule {}
