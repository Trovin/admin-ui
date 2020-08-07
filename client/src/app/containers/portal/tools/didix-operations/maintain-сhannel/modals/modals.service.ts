import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';

import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
import { DidixOperationsLuChannelResponseDto } from '@rest/didix-operations/lu-channel-response.dto';
import { DidixOperationsLuChannelUpdateRequestDto } from '@rest/didix-operations/lu-channel-update-request.dto';

import { DidixOperationsMaintainChannelModalComponent } from './create/create-modal.component';
import { ViewModalV2Component } from '@components/ui/modal-v2/view/view-modal.component';
import { BaseModalsService, ICreateModal, IUpdateModal, IViewModal } from '@components/ui/modal-v2/modal-v2.service';

@Injectable()
export class ModalsService extends BaseModalsService implements IUpdateModal, IViewModal, ICreateModal {
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

	openUpdateModal(dto: DidixOperationsLuChannelResponseDto): Subject<DidixOperationsLuChannelUpdateRequestDto> {
		const config = {
			initialState: {
				title: 'Update Channel',
				action: ModalActionsEnum.UPDATE,
				dto: dto
			}
		};

		this.bsModalRef = this.modalService.show(DidixOperationsMaintainChannelModalComponent, config);
		return this.bsModalRef.content.confirmed;
	}

	openCreateModal(dto: DidixOperationsLuChannelResponseDto): Subject<DidixOperationsLuChannelUpdateRequestDto> {
		const config = {
			initialState: {
				title: 'Create Channel',
				action: ModalActionsEnum.INSERT,
				dto: dto
			}
		};

		this.bsModalRef = this.modalService.show(DidixOperationsMaintainChannelModalComponent, config);
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
