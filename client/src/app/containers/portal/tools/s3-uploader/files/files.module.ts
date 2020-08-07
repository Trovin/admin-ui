import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PaginatorModule } from '@components/ui/paginator/paginator.module';
import { ColumnSortModule } from '@components/ui/table-column-sort/column-sort.module';

import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes';

import { FilesListComponent } from './files.component';

@NgModule({
	imports: [
		RouterModule,
		FormsModule,
		SharedModule,
		PipesModule,

		ColumnSortModule,
		PaginatorModule
	],
	declarations: [
		FilesListComponent
	],
	exports: [
		FilesListComponent
	],
	providers: []
})

export class FilesListModule {}
