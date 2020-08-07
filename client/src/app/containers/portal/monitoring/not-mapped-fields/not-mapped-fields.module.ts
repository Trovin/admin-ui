import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes/pipes.module';
import { AccordionModule } from '@components/ui/accordion/accordion.module';
import { SwitchControlModule } from '@components/ui/switch-control/switch-control.module';
import { DropdownItemPickerModule } from '@components/ui/dropdown-item-picker/dropdown-item-picker.module';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { NotMappedFieldsCommentModule } from './comment/comment.module';

import { NotMappedFieldsComponent } from './not-mapped-fields.component';
import { NotMappedFieldsRoutingModule } from './not-mapped-fields-routing.module';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		PipesModule,
		ReactiveFormsModule,
		SwitchControlModule,
		NotMappedFieldsCommentModule,
		NotMappedFieldsRoutingModule,
		DropdownItemPickerModule,
		AccordionModule,
		PageHeaderModule
	],
	declarations: [
		NotMappedFieldsComponent
	],
	exports: [
		NotMappedFieldsComponent
	]
})

export class NotMappedFieldsModule {}
