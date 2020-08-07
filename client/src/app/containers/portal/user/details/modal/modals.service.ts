import { Injectable } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ResourceType } from '@config/containers.enum';

import { BaseModalsService, IViewModal } from '@components/ui/modal-v2/modal-v2.service';

import { RequestPermissionComponent } from './request/request-modal.component';

@Injectable()
export class ModalsService extends BaseModalsService implements IViewModal {
	bsModalRef: BsModalRef;

	constructor(public modalService: BsModalService) {
		super(modalService);
	}

	openViewModal(unavailableResources:  ResourceType[], userEmail: string, userName: string) {
		const config = {
			ignoreBackdropClick: true,
			animated: true,
			class: 'modal-dialog-scrollable',
			initialState: {
				resources: unavailableResources,
				userEmail: userEmail,
				userName: userName
			}
		};

		this.bsModalRef = this.modalService.show(RequestPermissionComponent, config);
	}
}
