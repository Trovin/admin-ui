import { NgModule } from '@angular/core';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { SharedModule } from '@components/shared/shared.module';

import { ReconciliationDetailsModule } from './details/details.module';

import { ReconciliationComponent } from './reconciliation.component';

import { ReconciliationRoutingModule } from './reconciliation-routing.module';

@NgModule({
	imports: [
		SharedModule,
		PageHeaderModule,

		ReconciliationRoutingModule,

		ReconciliationDetailsModule
	],
	declarations: [
		ReconciliationComponent
	],
	exports: [
		ReconciliationComponent
	]
})

export class ReconciliationModule {}
