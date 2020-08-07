import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';

import { ConfirmationModalComponent } from './confirmation-modal.component';

@NgModule({
	imports: [
		ModalModule.forRoot(),
		CommonModule
	],
	declarations: [
		ConfirmationModalComponent
	],
	exports: [
		ConfirmationModalComponent
	],
	entryComponents: [
		ConfirmationModalComponent
	]
})

export class ConfirmationModalModule {}
