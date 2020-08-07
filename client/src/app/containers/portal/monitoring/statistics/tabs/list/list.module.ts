import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { PaginatorModule } from '@components/ui/paginator/paginator.module';

import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes';

import { MonitoringStatsEventTypesListModule } from './../event-types-list/list.module';

import { MonitoringStatsListComponent } from './list.component';


@NgModule({
	imports: [
		RouterModule,
		FormsModule,
		SharedModule,
		PipesModule,
		TooltipModule.forRoot(),
		PaginatorModule,

		MonitoringStatsEventTypesListModule
	],
	declarations: [
		MonitoringStatsListComponent
	],
	exports: [
		MonitoringStatsListComponent
	]
})

export class MonitoringStatsListModule {}
