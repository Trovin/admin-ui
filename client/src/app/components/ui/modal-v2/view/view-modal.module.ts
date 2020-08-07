import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';

import { FormMessageModule } from '@components/ui/form-message/form-message.module';

import { ViewModalV2Component } from './view-modal.component';
import { PipesModule } from '@components/ui/pipes';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ModalModule.forRoot(),
		PipesModule,

		FormMessageModule
	],
	declarations: [
		ViewModalV2Component
	],
	exports: [
		ViewModalV2Component
	],
	entryComponents: [
		ViewModalV2Component
	]
})

export class ViewModalV2Module {}
