import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes/pipes.module';
import { PaginatorModule } from '@components/ui/paginator/paginator.module';

import { MonitoringRedshiftDdlFormModule } from './form/form.module';

import { MonitoringRedshiftDdlComponent } from './redshift-ddl.component';
import { MonitoringRedshiftDdlRoutingModule } from './redshift-ddl-routing.module';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		PipesModule,
		PaginatorModule,
		PageHeaderModule,

		ModalModule.forRoot(),

		MonitoringRedshiftDdlFormModule,

		MonitoringRedshiftDdlRoutingModule
	],
	declarations: [
		MonitoringRedshiftDdlComponent
	],
	exports: [
		MonitoringRedshiftDdlComponent
	]
})

export class MonitoringRedshiftDdlModule {}
