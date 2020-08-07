import { NgModule } from '@angular/core';

import { SharedModule } from '@components/shared/shared.module';

import { ColumnSortV2Component } from './column-sort-v2.component';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		ColumnSortV2Component
	],
	exports: [
		ColumnSortV2Component
	]
})
export class ColumnSortV2Module {}
