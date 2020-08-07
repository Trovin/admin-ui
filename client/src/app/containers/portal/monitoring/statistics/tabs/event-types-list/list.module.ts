import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes';

import { MonitoringStatsEventTypesListComponent } from './list.component';

@NgModule({
	imports: [
		RouterModule,
		FormsModule,
		SharedModule,
		PipesModule
	],
	declarations: [
		MonitoringStatsEventTypesListComponent
	],
	exports: [
		MonitoringStatsEventTypesListComponent
	],
	providers: []
})

export class MonitoringStatsEventTypesListModule {}
