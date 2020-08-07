import { NgModule } from '@angular/core';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { PipesModule } from '@components/ui/pipes';
import { SharedModule } from '@components/shared/shared.module';
import { PaginatorV2Module } from '@components/ui/paginator-v2/paginator.module';
import { FormMessageModule } from '@components/ui/form-message/form-message.module';
import { ViewModalV2Module } from '@components/ui/modal-v2/view/view-modal.module';


import { DidixOperationsMaintainChannelModalModule } from './modals/create/create-modal.module';
import { DidixOperationsMaintainChannelComponent } from './maintain-сhannel.component';
import { DidixOperationsMaintainChannelRoutingModule } from './maintain-сhannel-routing.module';

@NgModule({
	imports: [
		SharedModule,
		PipesModule,
		PageHeaderModule,
		FormMessageModule,
		PaginatorV2Module,
		ViewModalV2Module,

		DidixOperationsMaintainChannelModalModule,

		DidixOperationsMaintainChannelRoutingModule
	],
	declarations: [
		DidixOperationsMaintainChannelComponent
	],
	exports: [
		DidixOperationsMaintainChannelComponent
	]
})

export class DidixOperationsMaintainChannelModule {}
