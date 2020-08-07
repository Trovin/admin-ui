import { Component, Input } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
@Component({
	selector: 'view-modal-v2',
	templateUrl: './view-modal.html'
})
export class ViewModalV2Component {
	@Input() title: string;
	@Input() item: string;
	@Input() action: ModalActionsEnum;
	@Input() json = false;

	constructor(public bsModalRef: BsModalRef
	) {}

	closeModal() {
		this.bsModalRef.hide();
	}
}
