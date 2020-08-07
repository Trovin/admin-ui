import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes/pipes.module';
import { AccordionModule } from '@components/ui/accordion/accordion.module';
import { PaginatorModule } from '@components/ui/paginator/paginator.module';
import { SwitchControlModule } from '@components/ui/switch-control/switch-control.module';
import { DropdownItemPickerModule } from '@components/ui/dropdown-item-picker/dropdown-item-picker.module';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';
import { DateRangeUiModule } from '@containers/shared/date-range-ui/date-range-ui.module';

import { RedshiftEmptyRecordsComponent } from './redshift-empty-records.component';
import { RedshiftEmptyRecordsRoutingModule } from './redshift-empty-records-routing.module';
import { DateRangeModule } from '@components/ui/date-range/date-range.module';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		PipesModule,
		ReactiveFormsModule,
		PaginatorModule,
		DateRangeUiModule,
		DateRangeModule,
		SwitchControlModule,
		DropdownItemPickerModule,
		AccordionModule,
		PageHeaderModule,

		RedshiftEmptyRecordsRoutingModule
	],
	declarations: [
		RedshiftEmptyRecordsComponent
	],
	exports: [
		RedshiftEmptyRecordsComponent
	]
})

export class RedshiftEmptyRecordsModule {}
