import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
import { ViewModalV2Component } from '@components/ui/modal-v2/view/view-modal.component';
import { BaseModalsService, IUpdateModal, IViewModal, IDeleteModal, ICreateModal } from '@components/ui/modal-v2/modal-v2.service';

import { DidixOperationsLuArticleResponseDto } from '@rest/didix-operations/lu-article-response.dto';
import { DidixOperationsLuArticleUpdateRequestDto } from '@rest/didix-operations/lu-article-update-request.dto';

import { DidixOperationsMaintainArticleFormUpdateComponent } from './create/create-modal.component';

@Injectable()
export class ModalsService extends BaseModalsService implements IUpdateModal, IViewModal, ICreateModal, IDeleteModal {
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

	openUpdateModal(dto: DidixOperationsLuArticleResponseDto): Subject<DidixOperationsLuArticleUpdateRequestDto> {
		const config = {
			initialState: {
				title: 'Update Article',
				action: ModalActionsEnum.UPDATE,
				dto: dto
			}
		};

		this.bsModalRef = this.modalService.show(DidixOperationsMaintainArticleFormUpdateComponent, config);
		return this.bsModalRef.content.confirmed;
	}

	openCreateModal(dto: DidixOperationsLuArticleResponseDto): Subject<DidixOperationsLuArticleUpdateRequestDto> {
		const config = {
			initialState: {
				title: 'Create Article',
				action: ModalActionsEnum.INSERT,
				dto: dto
			}
		};

		this.bsModalRef = this.modalService.show(DidixOperationsMaintainArticleFormUpdateComponent, config);
		return this.bsModalRef.content.confirmed;
	}

	openDeleteModal(dto: DidixOperationsLuArticleResponseDto): Subject<DidixOperationsLuArticleUpdateRequestDto> {
		const config = {
			initialState: {
				title: 'Delete Article',
				action: ModalActionsEnum.DELETE,
				dto: dto
			}
		};

		this.bsModalRef = this.modalService.show(DidixOperationsMaintainArticleFormUpdateComponent, config);
		return this.bsModalRef.content.confirmed;
	}

	toggleSubmit(status: boolean) {
		this.bsModalRef.content.toggleSubmit(status);
	}

	reset() {
		this.bsModalRef.content.reset();
	}
}
