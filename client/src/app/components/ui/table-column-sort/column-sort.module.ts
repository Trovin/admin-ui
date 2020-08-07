import { NgModule } from '@angular/core';
import { SharedModule } from '@components/shared/shared.module';

import { ColumnSortComponent } from './column-sort.component';

@NgModule({
	imports: [
		SharedModule
	],
	declarations: [
		ColumnSortComponent
	],
	exports: [
		ColumnSortComponent
	]
})
export class ColumnSortModule {}
