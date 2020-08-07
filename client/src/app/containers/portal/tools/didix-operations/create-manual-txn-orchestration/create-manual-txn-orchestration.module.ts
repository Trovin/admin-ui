import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { PipesModule } from '@components/ui/pipes';
import { SharedModule } from '@components/shared/shared.module';
import { PagerModule } from '@components/ui/paginator-v2/pager/pager.module';
import { PaginatorV2Module } from '@components/ui/paginator-v2/paginator.module';
import { ViewModalV2Module } from '@components/ui/modal-v2/view/view-modal.module';
import { FormMessageModule } from '@components/ui/form-message/form-message.module';

import { DropdownItemPickerModule } from '@components/ui/dropdown-item-picker/dropdown-item-picker.module';

import { DidixOperationsCreateManualTxnOrchestrationModalModule } from './modals/create/create-modal.module';
import { DidixOperationsCreateManualTxnOrchestrationComponent } from './create-manual-txn-orchestration.component';
import { DidixOperationsCreateManualTxnOrchestrationRoutingModule } from './create-manual-txn-orchestration-routing.module';

@NgModule({
	imports: [
		SharedModule,
		FormsModule,
		PipesModule,
		ReactiveFormsModule,
		PageHeaderModule,
		PaginatorV2Module,
		PagerModule,
		DropdownItemPickerModule,
		ViewModalV2Module,
		BsDatepickerModule.forRoot(),
		DidixOperationsCreateManualTxnOrchestrationModalModule,

		DidixOperationsCreateManualTxnOrchestrationRoutingModule
	],
	declarations: [
		DidixOperationsCreateManualTxnOrchestrationComponent
	],
	exports: [
		DidixOperationsCreateManualTxnOrchestrationComponent
	]
})

export class DidixOperationsCreateManualTxnOrchestrationModule {}
