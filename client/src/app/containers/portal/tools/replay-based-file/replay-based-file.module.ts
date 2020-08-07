import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes/';
import { PaginatorModule } from '@components/ui/paginator/paginator.module';
import { DropdownItemPickerModule } from '@components/ui/dropdown-item-picker/dropdown-item-picker.module';

import { ModalsModule } from './modal/modals.module';

import { ReplayBasedFileRoutingModule } from './replay-based-file-routing.module';
import { ReplayBasedFileComponent } from './replay-based-file.component';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		PipesModule,
		PaginatorModule,
		ModalsModule,
		BsDropdownModule.forRoot(),
		DropdownItemPickerModule,
		PageHeaderModule,

		ReplayBasedFileRoutingModule
	],
	declarations: [
		ReplayBasedFileComponent
	],
	exports: [
		ReplayBasedFileComponent
	]
})

export class ReplayBasedFileModule {}
