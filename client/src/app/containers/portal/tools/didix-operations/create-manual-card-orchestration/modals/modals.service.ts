import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
import { ViewModalV2Component } from '@components/ui/modal-v2/view/view-modal.component';
import { BaseModalsService, IDeleteModal, ICreateModal, IViewModal } from '@components/ui/modal-v2/modal-v2.service';

import { DidixOperationsLuCardResponseDto } from '@rest/didix-operations/lu-card-response.dto';
import { DidixOperationsCreateManualCardRequestDto } from '@rest/didix-operations/create-manual-card-orchestration-request.dto';

import { DidixOperationsCreateManualCardOrchestrationModalComponent } from './create/create-modal.component';

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

	openCreateModal(dto: DidixOperationsLuCardResponseDto): Subject<DidixOperationsCreateManualCardRequestDto> {
		const config = {
			initialState: {
				title: 'Create Card',
				action: ModalActionsEnum.INSERT,
				dto: dto
			}
		};

		this.bsModalRef = this.modalService.show(DidixOperationsCreateManualCardOrchestrationModalComponent, config);
		return this.bsModalRef.content.confirmed;
	}

	openDeleteModal(dto: DidixOperationsLuCardResponseDto): Subject<DidixOperationsCreateManualCardRequestDto> {
		const config = {
			initialState: {
				title: 'Delete Card',
				action: ModalActionsEnum.DELETE,
				dto: dto
			}
		};

		this.bsModalRef = this.modalService.show(DidixOperationsCreateManualCardOrchestrationModalComponent, config);
		return this.bsModalRef.content.confirmed;
	}
}
