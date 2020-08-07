import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { SharedModule } from '@components/shared/shared.module';
import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { RedshiftTablesComponent } from './redshift-tables.component';
import { RedshiftTablesRoutingModule } from './redshift-tables-routing.module';
import { TreeviewSelectModule } from '@components/ui/treeview-select/treeview-select.module';


@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		TreeviewSelectModule,

		PageHeaderModule,
		RedshiftTablesRoutingModule
	],
	declarations: [
		RedshiftTablesComponent
	],
	exports: [
		RedshiftTablesComponent
	]
})

export class RedshiftTablesModule {}
