import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';

import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
import { ViewModalV2Component } from '@components/ui/modal-v2/view/view-modal.component';
import { BaseModalsService, IViewModal, IUpdateModal } from '@components/ui/modal-v2/modal-v2.service';

import { IDidixOperationsFctProductPlanColumnResponseDto } from '@rest/didix-operations/fct-product-plan-response.dto';
import { DidixOperationsFctProductPlanUpdateRequestDto } from '@rest/didix-operations/fct-product-plan-update-request.dto';

import { DidixOperationsFctProductPlanWkOrchestrationFormUpdateModalComponent } from './create/create-modal.component';

@Injectable()
export class ModalsService extends BaseModalsService implements IUpdateModal, IViewModal {
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
	}

	openUpdateModal(dto: IDidixOperationsFctProductPlanColumnResponseDto, fiscalYearId: number): Subject<DidixOperationsFctProductPlanUpdateRequestDto> {
		const config = {
			initialState: {
				title: 'Update Planned Sales',
				action: ModalActionsEnum.UPDATE,
				fiscalYearId: fiscalYearId,
				dto: dto
			}
		};

		this.bsModalRef = this.modalService.show(DidixOperationsFctProductPlanWkOrchestrationFormUpdateModalComponent, config);
		return this.bsModalRef.content.confirmed;
	}

	toggleSubmit(status: boolean) {
		this.bsModalRef.content.toggleSubmit(status);
	}

	reset() {
		this.bsModalRef.content.reset();
	}
}
