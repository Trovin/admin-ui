import { Component } from '@angular/core';

import { Subject } from 'rxjs';

import { ModalOptions, BsModalRef } from 'ngx-bootstrap/modal';

import { ModalEventType } from '@enums/modal-event-type';

export interface IConfirmationInitialState {
	messageWithHtml?: string;
	message?: string;
	disable?: boolean;
}

@Component({
	selector: 'confirmation-modal',
	templateUrl: './confirmation.html'
})

export class ConfirmationComponent {
	changed = new Subject<string>();

	constructor(
		private modalRef: BsModalRef,
		public options: ModalOptions
	) {}

	showConfirmationModal() {
		this.options.show = true;
	}

	confirm() {
		const evenType = ModalEventType.getAlias(ModalEventType.CONFIRM);
		this.changed.next(evenType);
		this.modalRef.hide();
	}

	decline() {
		const evenType = ModalEventType.getAlias(ModalEventType.DECLINE);
		this.changed.next(evenType);
		this.modalRef.hide();
	}
}
