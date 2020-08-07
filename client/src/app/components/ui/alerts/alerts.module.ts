import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@components/shared/shared.module';

import { AlertsComponent } from './alerts.component';

@NgModule({
	imports: [
		RouterModule,
		SharedModule
	],
	declarations: [
		AlertsComponent
	],
	exports: [
		AlertsComponent
	]
})

export class AlertsModule {}