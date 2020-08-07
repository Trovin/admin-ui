import { NgModule } from '@angular/core';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { PipesModule } from '@components/ui/pipes';
import { SharedModule } from '@components/shared/shared.module';
import { PaginatorV2Module } from '@components/ui/paginator-v2/paginator.module';
import { FormMessageModule } from '@components/ui/form-message/form-message.module';

import { ViewModalV2Module } from '@components/ui/modal-v2/view/view-modal.module';

import { DidixOperationsMaintainArticleFormUpdateModalModule } from './modals/create/create-modal.module';
import { DidixOperationsMaintainArticlesFormUpdateComponent } from './update.component';
import { DidixOperationsMaintainArticlesFormUpdateRoutingModule } from './update-routing.module';

@NgModule({
	imports: [
		SharedModule,
		PipesModule,
		PageHeaderModule,
		FormMessageModule,
		PaginatorV2Module,

		ViewModalV2Module,
		DidixOperationsMaintainArticleFormUpdateModalModule,
		DidixOperationsMaintainArticlesFormUpdateRoutingModule
	],
	declarations: [
		DidixOperationsMaintainArticlesFormUpdateComponent
	],
	exports: [
		DidixOperationsMaintainArticlesFormUpdateComponent
	]
})

export class DidixOperationsMaintainArticlesFormUpdateModule {}
