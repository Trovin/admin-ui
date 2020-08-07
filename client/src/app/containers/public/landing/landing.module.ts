
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@components/shared/shared.module';

import { NavigationModule } from './../shared/nav/nav.module';

import { LandingComponent } from './landing.component';
import { LandingRoutingModule } from './landing-routing.module';

@NgModule({
	imports: [
		SharedModule,
		RouterModule,

		NavigationModule,

		LandingRoutingModule
	],
	declarations: [
		LandingComponent
	],
	exports: [
		LandingComponent
	],
	providers: []
})

export class LandingModule {}
