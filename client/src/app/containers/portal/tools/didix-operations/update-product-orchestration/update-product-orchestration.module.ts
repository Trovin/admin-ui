import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { SharedModule } from '@components/shared/shared.module';
import { PaginatorV2Module } from '@components/ui/paginator-v2/paginator.module';
import { FormMessageModule } from '@components/ui/form-message/form-message.module';
import { ViewModalV2Module } from '@components/ui/modal-v2/view/view-modal.module';

import { DidixOperationsUpdateProductOrchestrationCreateModalModule } from './modals/create/create-modal.module';

import { DidixOperationsUpdateProductOrchestrationComponent } from './update-product-orchestration.component';
import { DidixOperationsUpdateProductOrchestrationRoutingModule } from './update-product-orchestration-routing.module';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		ReactiveFormsModule,
		PageHeaderModule,
		FormMessageModule,
		PaginatorV2Module,
		ViewModalV2Module,

		DidixOperationsUpdateProductOrchestrationCreateModalModule,

		DidixOperationsUpdateProductOrchestrationRoutingModule
	],
	declarations: [
		DidixOperationsUpdateProductOrchestrationComponent
	],
	exports: [
		DidixOperationsUpdateProductOrchestrationComponent
	]
})

export class DidixOperationssUpdateProductOrchestrationModule {}
