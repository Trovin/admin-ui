import { NgModule } from '@angular/core';

import { SharedModule } from '@components/shared/shared.module';

import { DidixOperationsMaintainStoresComponent } from './maintain-stores.component';
import { DidixOperationsMaintainStoresRoutingModule } from './maintain-stores-routing.module';

@NgModule({
	imports: [
		SharedModule,

		DidixOperationsMaintainStoresRoutingModule
	],
	declarations: [
		DidixOperationsMaintainStoresComponent
	],
	exports: [
		DidixOperationsMaintainStoresComponent
	]
})

export class DidixOperationsMaintainStoresModule {}
