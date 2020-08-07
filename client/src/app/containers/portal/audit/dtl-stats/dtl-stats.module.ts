import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { SharedModule } from '@components/shared/shared.module';
import { PermissionsDirectiveModule } from '@core/permissions/directive/permissions-directive.module';

import { PipesModule } from '@components/ui/pipes/pipes.module';
import { PaginatorV2Module } from '@components/ui/paginator-v2/paginator.module';
import { ConfirmationModule } from '@components/ui/confirmation/confirmation.module';
import { ColumnSortModule } from '@components/ui/table-column-sort/column-sort.module';

import { AuditStatsBaseFormModule } from './../shared/form/form.module';
import { AuditActionsModule } from './../shared/group-actions/group-actions.module';
import { AuditHeaderModule } from './../shared/header/header.module';

import { AuditDTLOutputStatsModule } from './output-stats/output-stats.module';

import { AuditDTLStatsRoutingModule } from './dtl-stats-routing.module';
import { AuditDTLStatsComponent } from './dtl-stats.component';

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

		AuditDTLStatsRoutingModule,

		AuditStatsBaseFormModule,
		AuditActionsModule,
		AuditDTLOutputStatsModule,
		AuditHeaderModule
	],
	declarations: [
		AuditDTLStatsComponent
	],
	exports: [
		AuditDTLStatsComponent
	]
})

export class AuditDTLStatsModule {}
