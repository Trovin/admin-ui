import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { SharedModule } from '@components/shared/shared.module';

import { DropdownItemPickerModule } from '@components/ui/dropdown-item-picker/dropdown-item-picker.module';
import { ColumnSortV2Module } from '@components/ui/table-column-sort-v2';
import { PaginatorV2Module } from '@components/ui/paginator-v2/paginator.module';
import { SwitchControlModule } from '@components/ui/switch-control/switch-control.module';

import { SourceCatalogComponent } from './source-catalog.component';
import { SourceCatalogRoutingModule } from './source-catalog-routing.module';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		ColumnSortV2Module,
		PaginatorV2Module,
		SwitchControlModule,
		BsDropdownModule.forRoot(),
		PageHeaderModule,

		DropdownItemPickerModule,

		SourceCatalogRoutingModule
	],
	declarations: [
		SourceCatalogComponent
	],
	exports: [
		SourceCatalogComponent
	]
})

export class SourceCatalogModule {}
