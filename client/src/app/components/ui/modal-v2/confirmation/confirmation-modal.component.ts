import { Component, Input } from '@angular/core';

import { Subject } from 'rxjs';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
@Component({
	selector: 'confirmation-modal',
	templateUrl: './confirmation-modal.html'
})
export class ConfirmationModalComponent {
	confirmed = new Subject<boolean>();

	@Input() title = '';
	@Input() textContent = '';
	@Input() action: ModalActionsEnum;

	modalActions = ModalActionsEnum;

	constructor(public bsModalRef: BsModalRef) {}

	confirm() {
		this.confirmed.next(true);
		this.closeModal();
	}

	decline() {
		this.confirmed.next(false);
		this.closeModal();
	}

	private closeModal() {
		this.confirmed.complete();
		this.bsModalRef.hide();
	}
}
