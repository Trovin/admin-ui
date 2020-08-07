import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PaginatorModule } from '@components/ui/paginator/paginator.module';
import { ColumnSortModule } from '@components/ui/table-column-sort/column-sort.module';

import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes';

import { ModalsModule } from './../modal/modals.module';

import { ListItemActionsModule } from './list-item-actions/list-item-actions.module';
import { AutoConfFilesListComponent } from './list.component';

@NgModule({
	imports: [
		RouterModule,
		FormsModule,
		SharedModule,
		PipesModule,

		ModalsModule,
		ColumnSortModule,
		PaginatorModule,
		ListItemActionsModule
	],
	declarations: [
		AutoConfFilesListComponent
	],
	exports: [
		AutoConfFilesListComponent
	],
	providers: []
})

export class AutoConfFilesListModule {}
