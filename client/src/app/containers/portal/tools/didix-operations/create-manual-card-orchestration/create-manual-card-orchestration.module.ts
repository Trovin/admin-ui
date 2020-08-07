import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { PageHeaderModule } from '@containers/shared/page-header/page-header.module';

import { PipesModule } from '@components/ui/pipes';
import { SharedModule } from '@components/shared/shared.module';
import { PaginatorV2Module } from '@components/ui/paginator-v2/paginator.module';
import { PagerModule } from '@components/ui/paginator-v2/pager/pager.module';
import { ViewModalV2Module } from '@components/ui/modal-v2/view/view-modal.module';
import { FormMessageModule } from '@components/ui/form-message/form-message.module';
import { DropdownItemPickerModule } from '@components/ui/dropdown-item-picker/dropdown-item-picker.module';

import { DidixOperationsCreateManualCardOrchestrationModalModule } from './modals/create/create-modal.module';

import { DidixOperationsCreateManualCardOrchestrationComponent } from './create-manual-card-orchestration.component';
import { DidixOperationsCreateManualCardOrchestrationRoutingModule } from './create-manual-card-orchestration-routing.module';

@NgModule({
	imports: [
		SharedModule,
		PipesModule,
		PageHeaderModule,
		ReactiveFormsModule,
		PageHeaderModule,
		FormMessageModule,
		PaginatorV2Module,
		PagerModule,
		DropdownItemPickerModule,
		ViewModalV2Module,
		BsDatepickerModule.forRoot(),
		DidixOperationsCreateManualCardOrchestrationModalModule,

		DidixOperationsCreateManualCardOrchestrationRoutingModule
	],
	declarations: [
		DidixOperationsCreateManualCardOrchestrationComponent
	],
	exports: [
		DidixOperationsCreateManualCardOrchestrationComponent
	]
})
export class DidixOperationsCreateManualCardOrchestrationModule {}
