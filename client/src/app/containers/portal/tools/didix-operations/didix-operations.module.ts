import { NgModule } from '@angular/core';

import { SharedModule } from '@components/shared/shared.module';

import { DidixOperationsComponent } from './didix-operations.component';
import { DidixOperationsRoutingModule } from './didix-operations-routing.module';

@NgModule({
	imports: [
		SharedModule,

		DidixOperationsRoutingModule
	],
	declarations: [
		DidixOperationsComponent
	],
	exports: [
		DidixOperationsComponent
	]
})

export class DidixOperationsModule {}
