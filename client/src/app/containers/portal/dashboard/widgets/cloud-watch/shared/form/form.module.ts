import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@components/shared/shared.module';

import { DateRangeModule } from '@components/ui/date-range/date-range.module';

import { CloudWatchWidgetFormComponent } from './form.component';


@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		ReactiveFormsModule,

		DateRangeModule
	],
	declarations: [
		CloudWatchWidgetFormComponent
	],
	exports: [
		CloudWatchWidgetFormComponent
	]
})

export class CloudWatchWidgetFormModule {}
