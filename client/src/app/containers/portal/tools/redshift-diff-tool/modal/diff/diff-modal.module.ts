import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';

import { DiffToolModule } from '@components/ui/diff-tool/diff-tool.module';

import { DiffModalComponent } from './diff-modal.component';

@NgModule({
	imports: [
		CommonModule,
		ModalModule.forRoot(),

		DiffToolModule
	],
	declarations: [
		DiffModalComponent
	],
	exports: [
		DiffModalComponent
	],
	entryComponents: [
		DiffModalComponent
	]
})

export class DiffModalModule {}
