import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { ModalEventType } from '@enums/modal-event-type';

@Component({
	selector: 'confirm-modal',
	templateUrl: './confirm-modal.html'
})

export class ConfirmModalComponent {
	confirmed = new Subject<string>();
	message: string;

	constructor(public bsModalRef: BsModalRef) {}

	confirm() {
		const evenType = ModalEventType.getAlias(ModalEventType.CONFIRM);
		this.confirmed.next(evenType);
		this.bsModalRef.hide();
	}

	decline() {
		this.bsModalRef.hide();
	}
}
