import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes/pipes.module';
import { PaginatorV2Module } from '@components/ui/paginator-v2/paginator.module';
import { ConfirmationModule } from '@components/ui/confirmation/confirmation.module';
import { ColumnSortModule } from '@components/ui/table-column-sort/column-sort.module';

import { PermissionsDirectiveModule } from '@core/permissions/directive/permissions-directive.module';

import { AuditStatsBaseFormModule } from './../shared/form/form.module';
import { AuditActionsModule } from './../shared/group-actions/group-actions.module';
import { AuditHeaderModule } from './../shared/header/header.module';

import { AuditBatchOutputModule } from './output/output.module';

import { AuditBatchRoutingModule } from './batch-routing.module';
import { AuditBatchComponent } from './batch.component';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		PipesModule,
		PermissionsDirectiveModule,
		TooltipModule.forRoot(),

		PaginatorV2Module,
		ConfirmationModule,
		ColumnSortModule,
		BsDropdownModule.forRoot(),

		AuditStatsBaseFormModule,
		AuditActionsModule,
		AuditBatchOutputModule,
		AuditHeaderModule,

		AuditBatchRoutingModule
	],
	declarations: [
		AuditBatchComponent
	],
	exports: [
		AuditBatchComponent
	]
})

export class AuditBatchModule {}
