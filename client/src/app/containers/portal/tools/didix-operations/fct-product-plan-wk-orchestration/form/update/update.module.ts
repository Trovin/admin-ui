import { NgModule } from '@angular/core';

import { PageHeaderModule } from '@shared/page-header/page-header.module';

import { PipesModule } from '@components/ui/pipes';
import { SharedModule } from '@components/shared/shared.module';
import { PaginatorV2Module } from '@components/ui/paginator-v2/paginator.module';
import { ViewModalV2Module } from '@components/ui/modal-v2/view/view-modal.module';

import { DidixOperationsFctProductPlanWkOrchestrationFormUpdateModalModule } from './modals/create/create-modal.module';
import { DidixOperationsFctProductPlanWkOrchestrationFormUpdateComponent } from './update.component';
import { DidixOperationsFctProductPlanWkOrchestrationFormUpdateRoutingModule } from './update-routing.module';


@NgModule({
	imports: [
		SharedModule,
		PipesModule,
		PaginatorV2Module,
		PageHeaderModule,

		ViewModalV2Module,
		DidixOperationsFctProductPlanWkOrchestrationFormUpdateModalModule,
		DidixOperationsFctProductPlanWkOrchestrationFormUpdateRoutingModule
	],
	declarations: [
		DidixOperationsFctProductPlanWkOrchestrationFormUpdateComponent
	],
	exports: [
		DidixOperationsFctProductPlanWkOrchestrationFormUpdateComponent
	]
})

export class DidixOperationsFctProductPlanWkOrchestrationFormUpdateModule {}
