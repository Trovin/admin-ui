import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';

import { ConfirmModalComponent } from './confirm-modal.component';

@NgModule({
	imports: [
		CommonModule,
		ModalModule.forRoot()
	],
	declarations: [
		ConfirmModalComponent
	],
	exports: [
		ConfirmModalComponent
	],
	entryComponents: [
		ConfirmModalComponent
	]
})

export class ConfirmModalModule {}
