import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';

import { PipesModule } from '@components/ui/pipes';

import { ConfirmationComponent } from './confirmation.component';

@NgModule({
	imports: [
		CommonModule,
		PipesModule,

		ModalModule.forRoot()
	],
	declarations: [
		ConfirmationComponent
	],
	exports: [
		ConfirmationComponent
	],
	entryComponents: [
		ConfirmationComponent
	]
})

export class ConfirmationModule {}
