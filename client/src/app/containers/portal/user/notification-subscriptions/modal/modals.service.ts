import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ModalEventType } from '@enums/modal-event-type';

import { ConfirmModalComponent } from './confirm/confirm-modal.component';
import { ActionModalComponent } from './action/action-modal.component';

export interface IModalCreateData {
	userEmail: string;
	creatorEmail: string;
	title: string;
}

@Injectable()
export class ModalsService {
	bsModalRef: BsModalRef;

	constructor(private modalService: BsModalService) {}

	openConfirmModal(message: string): Subject<boolean> {
		const subj = new Subject<boolean>();

		const events = [ModalEventType.DECLINE, ModalEventType.ESC, ModalEventType.BACKDROPCLICK];
		const config = {
			class: 'modal-sm',
			animated: true,
			initialState: {
				message: message
			}
		};

		this.bsModalRef = this.modalService.show(ConfirmModalComponent, config);
		this.bsModalRef.content.confirmed
			.subscribe((e: string) => {
				const evenType = ModalEventType.getByAlias(e);
				const status = !!evenType && !~events.indexOf(evenType);
				subj.next(status);
				subj.complete();
			});

		return subj;
	}

	openCreateModal(data: IModalCreateData): Subject<void> {
		const subj = new Subject<void>();

		const config = {
			ignoreBackdropClick: true,
			initialState: {
				data: data,
				textControlBtn: 'Create',
				title: data.title
			}
		};

		this.bsModalRef = this.modalService.show(ActionModalComponent, config);

		this.bsModalRef.content.createSubj
			.subscribe(config => {
				subj.next(config);
				subj.complete();
			});

		return subj;
	}
}
