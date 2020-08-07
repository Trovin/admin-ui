import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { FormMessageModule } from '@components/ui/form-message/form-message.module';

import { DidixOperationsMaintainArticleFormUpdateComponent } from './create-modal.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ModalModule.forRoot(),
		BsDatepickerModule.forRoot(),

		FormMessageModule
	],
	declarations: [
		DidixOperationsMaintainArticleFormUpdateComponent
	],
	exports: [
		DidixOperationsMaintainArticleFormUpdateComponent
	],
	entryComponents: [
		DidixOperationsMaintainArticleFormUpdateComponent
	]
})

export class DidixOperationsMaintainArticleFormUpdateModalModule {}
