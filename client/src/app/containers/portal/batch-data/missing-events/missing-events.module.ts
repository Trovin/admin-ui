import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PipesModule } from '@components/ui/pipes';
import { SharedModule } from '@components/shared/shared.module';
import { PaginatorModule } from '@components/ui/paginator/paginator.module';
import { ColumnSortModule } from '@components/ui/table-column-sort/column-sort.module';

import { BatchDataMissingEventsComponent } from './missing-events.component';

@NgModule({
	imports: [
		SharedModule,
		RouterModule,
		FormsModule,
		PipesModule,
		PaginatorModule,
		ColumnSortModule
	],
	declarations: [
		BatchDataMissingEventsComponent
	],
	exports: [
		BatchDataMissingEventsComponent
	]
})

export class BatchDataMissingEventsModule {}
