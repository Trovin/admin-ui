import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { PipesModule } from '@components/ui/pipes';
import { SharedModule } from '@components/shared/shared.module';
import { FormMessageModule } from '@components/ui/form-message/form-message.module';
import { DropdownItemPickerModule } from '@components/ui/dropdown-item-picker/dropdown-item-picker.module';

import { DidixOperationsMaintainArticlesFormComponent } from './form.component';
import { DidixOperationsMaintainArticlesFormRoutingModule } from './form-routing.module';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		PipesModule,
		ReactiveFormsModule,
		PageHeaderModule,
		FormMessageModule,

		BsDatepickerModule.forRoot(),

		DropdownItemPickerModule,

		DidixOperationsMaintainArticlesFormRoutingModule
	],
	declarations: [
		DidixOperationsMaintainArticlesFormComponent
	],
	exports: [
		DidixOperationsMaintainArticlesFormComponent
	]
})

export class DidixOperationsMaintainArticlesFormModule {}
