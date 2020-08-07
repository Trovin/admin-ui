import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { PipesModule } from '@components/ui/pipes';
import { SharedModule } from '@components/shared/shared.module';
import { PaginatorModule } from '@components/ui/paginator/paginator.module';
import { ColumnSortModule } from '@components/ui/table-column-sort/column-sort.module';

import { BatchDataParamsService } from './shared/params.service';

import { BatchDataTabsComponent } from './tabs.component';
import { BatchDataFormModule } from './form/form.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
	imports: [
		SharedModule,
		RouterModule,
		PipesModule,
		PaginatorModule,
		ColumnSortModule,
		TooltipModule.forRoot(),
		PageHeaderModule,

		BatchDataFormModule
	],
	declarations: [
		BatchDataTabsComponent
	],
	exports: [
		BatchDataTabsComponent
	],
	providers: [
		BatchDataParamsService
	]
})

export class BatchDataTabsModule {}
