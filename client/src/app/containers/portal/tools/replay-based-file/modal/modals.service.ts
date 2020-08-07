import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ModalEventType } from '@enums/modal-event-type';

import { ConfirmationComponent } from '@components/ui/confirmation/confirmation.component';

@Injectable()
export class ModalsService {
	bsModalRef: BsModalRef;

	constructor(private modalService: BsModalService) {}

	openConfirmModal(message: string) {
		const subj = new Subject<boolean>();

		const events = [ModalEventType.DECLINE, ModalEventType.ESC, ModalEventType.BACKDROPCLICK];
		const config = {
			class: 'modal-md',
			animated: true,
			initialState: {
				messageWithHtml: message
			}
		};

		this.bsModalRef = this.modalService.show(ConfirmationComponent, config);
		(<ConfirmationComponent>this.bsModalRef.content).showConfirmationModal();

		this.bsModalRef.content.changed
			.subscribe((e: string) => {
				const evenType = ModalEventType.getByAlias(e);
				const status = !!evenType && !~events.indexOf(evenType);
				subj.next(status);
				subj.complete();
			});

		return subj;
	}
}
