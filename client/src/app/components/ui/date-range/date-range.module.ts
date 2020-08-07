import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { SharedModule } from '@components/shared/shared.module';

import { DateRangeComponent } from './date-range/date-range.component';
import { MaterialDateRangeComponent } from './material-date-range/material-date-range.component';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		BsDatepickerModule.forRoot()
	],
	declarations: [
		DateRangeComponent,
		MaterialDateRangeComponent
	],
	exports: [
		DateRangeComponent,
		MaterialDateRangeComponent
	]
})

export class DateRangeModule {}
