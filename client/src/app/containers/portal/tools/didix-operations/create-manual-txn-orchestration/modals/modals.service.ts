import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
import { ViewModalV2Component } from '@components/ui/modal-v2/view/view-modal.component';
import { BaseModalsService, IDeleteModal, ICreateModal, IViewModal } from '@components/ui/modal-v2/modal-v2.service';

import { DidixOperationsCreateManualTxnOrchestrationModalComponent } from './create/create-modal.component';
import { DidixOperationsLuTransactionResponseDto } from '@rest/didix-operations/lu-transaction-response.dto';
import { DidixOperationsCreateManualTxnRequestDto } from '@rest/didix-operations/create-manual-txn-orchestration-request.dto';


@Injectable()
export class ModalsService extends BaseModalsService implements IDeleteModal, ICreateModal, IViewModal {
	bsModalRef: BsModalRef;

	constructor(public modalService: BsModalService) {
		super(modalService);
	}

	openViewModal(item: string, isJson = false) {
		const config = {
			initialState: {
				title: isJson ? 'Json request' : 'Status message',
				action: ModalActionsEnum.VIEW,
				item: item,
				json: isJson
			}
		};

		this.bsModalRef = this.modalService.show(ViewModalV2Component, config);
		return this.bsModalRef.content.confirmed;
	}

	openCreateModal(dto: DidixOperationsLuTransactionResponseDto): Subject<DidixOperationsCreateManualTxnRequestDto> {
		const config = {
			initialState: {
				title: 'Create Transaction',
				action: ModalActionsEnum.INSERT,
				dto: dto
			}
		};

		this.bsModalRef = this.modalService.show(DidixOperationsCreateManualTxnOrchestrationModalComponent, config);
		return this.bsModalRef.content.confirmed;
	}

	openDeleteModal(dto: DidixOperationsLuTransactionResponseDto): Subject<DidixOperationsCreateManualTxnRequestDto> {
		const config = {
			initialState: {
				title: 'Delete Transaction',
				action: ModalActionsEnum.DELETE,
				dto: dto
			}
		};

		this.bsModalRef = this.modalService.show(DidixOperationsCreateManualTxnOrchestrationModalComponent, config);
		return this.bsModalRef.content.confirmed;
	}
}
