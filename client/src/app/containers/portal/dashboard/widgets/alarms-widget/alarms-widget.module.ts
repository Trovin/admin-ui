import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@components/shared/shared.module';
import { PipesModule } from '@components/ui/pipes';

import { AlarmsWidgetComponent } from './alarms-widget.component';

@NgModule({
	imports: [
		RouterModule,
		SharedModule,
		PipesModule
	],
	declarations: [
		AlarmsWidgetComponent
	],
	exports: [
		AlarmsWidgetComponent
	],
	providers: []
})

export class AlarmsWidgetModule {}
