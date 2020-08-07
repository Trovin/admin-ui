import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';
import { FormMessageModule } from '@components/ui/form-message/form-message.module';

import { CloudWatchWidgetCreateModalComponent } from './create-modal.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,

		FormMessageModule,

		ModalModule.forRoot()
	],
	declarations: [
		CloudWatchWidgetCreateModalComponent
	],
	exports: [
		CloudWatchWidgetCreateModalComponent
	],
	entryComponents: [
		CloudWatchWidgetCreateModalComponent
	]
})

export class CloudWatchWidgetControlModalModule {}
