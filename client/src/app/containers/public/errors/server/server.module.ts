import { NgModule } from '@angular/core';

import { SharedModule } from '@components/shared/shared.module';

import { ErrorsServerRoutingModule } from './server-routing.module';
import { ErrorsServerComponent } from './server.component';

@NgModule({
	imports: [
		SharedModule,
		ErrorsServerRoutingModule
	],
	declarations: [
		ErrorsServerComponent
	],
	exports: [
		ErrorsServerComponent
	]
})
export class ErrorsServerModule {}