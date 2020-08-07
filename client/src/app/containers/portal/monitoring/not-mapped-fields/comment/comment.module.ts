import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@components/shared/shared.module';

import { NotMappedFieldsCommentComponent } from './comment.component';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		ReactiveFormsModule
	],
	declarations: [
		NotMappedFieldsCommentComponent
	],
	exports: [
		NotMappedFieldsCommentComponent
	]
})

export class NotMappedFieldsCommentModule {}
