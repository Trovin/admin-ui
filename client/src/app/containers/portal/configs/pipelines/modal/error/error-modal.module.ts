import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';

import { ErrorModalComponent } from './error-modal.component';

@NgModule({
	imports: [
		CommonModule,
		ModalModule.forRoot()
	],
	declarations: [
		ErrorModalComponent
	],
	exports: [
		ErrorModalComponent
	],
	entryComponents: [
		ErrorModalComponent
	]
})

export class ErrorModalModule {}
