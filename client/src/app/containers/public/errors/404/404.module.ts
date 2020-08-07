import { NgModule } from '@angular/core';

import { SharedModule } from '@components/shared/shared.module';

import { Errors404RoutingModule } from './404-routing.module';
import { Errors404Component } from './404.component';

@NgModule({
	imports: [
		SharedModule,
		Errors404RoutingModule
	],
	declarations: [
		Errors404Component
	],
	exports: [
		Errors404Component
	]
})
export class Errors404Module {}