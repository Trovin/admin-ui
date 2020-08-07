import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { BaseModalsService, IConfirmModal } from '@components/ui/modal-v2/modal-v2.service';
import { ConfirmationModalComponent } from '@components/ui/modal-v2/confirmation/confirmation-modal.component';

@Injectable()
export class ModalsService extends BaseModalsService implements IConfirmModal {
	bsModalRef: BsModalRef;

	constructor(public modalService: BsModalService) {
		super(modalService);
	}

	openConfirmModal(missingConfig: string, sourceApplication: string, eventId: string): Subject<boolean> {
		const config = {
			animated: true,
			initialState: {
				title: 'Delete operation',
				textContent: `You are going to delete a draft ${missingConfig} config for <span class="text-primary small bold bold">${sourceApplication}/${eventId}</span>. Are you sure?`
			}
		};

		this.bsModalRef = this.modalService.show(ConfirmationModalComponent, config);
		return this.bsModalRef.content.confirmed;
	}
}
