import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
import { ViewModalV2Component } from '@components/ui/modal-v2/view/view-modal.component';
import { BaseModalsService, ICreateModal, IUpdateModal, IViewModal } from '@components/ui/modal-v2/modal-v2.service';

import { DidixOperationsLuStoreResponseDto } from '@rest/didix-operations/lu-store-response.dto';
import { DidixOperationsLuStoreUpdateRequestDto } from '@rest/didix-operations/lu-store-update-request.dto';

import { DidixOperationsMaintainStoresFormUpdateModalComponent } from './create/create-modal.component';

@Injectable()
export class ModalsService extends BaseModalsService implements IUpdateModal, IViewModal, ICreateModal {
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

	openUpdateModal(dto: DidixOperationsLuStoreResponseDto): Subject<DidixOperationsLuStoreUpdateRequestDto> {
		const config = {
			initialState: {
				title: 'Update Store',
				action: ModalActionsEnum.UPDATE,
				dto: dto
			}
		};

		this.bsModalRef = this.modalService.show(DidixOperationsMaintainStoresFormUpdateModalComponent, config);
		return this.bsModalRef.content.confirmed;
	}

	openCreateModal(dto: DidixOperationsLuStoreResponseDto): Subject<DidixOperationsLuStoreUpdateRequestDto> {
		const config = {
			initialState: {
				title: 'Create Store',
				action: ModalActionsEnum.INSERT,
				dto: dto
			}
		};

		this.bsModalRef = this.modalService.show(DidixOperationsMaintainStoresFormUpdateModalComponent, config);
		return this.bsModalRef.content.confirmed;
	}

	closeModal() {
		this.bsModalRef.content.closeModal();
		this.bsModalRef.content.reset();
	}

	toggleSubmit(status: boolean) {
		this.bsModalRef.content.toggleSubmit(status);
	}

	reset() {
		this.bsModalRef.content.reset();
	}
}
