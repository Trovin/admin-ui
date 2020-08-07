import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';

import { FormMessageModule } from '@components/ui/form-message/form-message.module';

import { ConfigStorageGenerateConfigModalComponent } from './generate-config.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ModalModule.forRoot(),

		FormMessageModule
	],
	declarations: [
		ConfigStorageGenerateConfigModalComponent
	],
	exports: [
		ConfigStorageGenerateConfigModalComponent
	],
	entryComponents: [
		ConfigStorageGenerateConfigModalComponent
	]
})

export class ConfigStorageModalModule {}
