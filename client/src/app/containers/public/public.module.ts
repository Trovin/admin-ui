import { NgModule } from '@angular/core';

import { SharedModule } from '@components/shared/shared.module';

import { PublicComponent } from './public.component';
import { PublicRoutingModule } from './public-routing.module';

@NgModule({
	imports: [
		SharedModule,

		PublicRoutingModule
	],
	declarations: [
		PublicComponent
	],
	exports: [
		PublicComponent
	],
	providers: []
})

export class PublicModule {}
