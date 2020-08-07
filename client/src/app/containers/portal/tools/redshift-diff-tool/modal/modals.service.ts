import { Injectable } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { BaseModalsService, IViewModal } from '@components/ui/modal-v2/modal-v2.service';

import { DiffModalComponent } from './diff/diff-modal.component';

@Injectable()
export class ModalsService extends BaseModalsService implements IViewModal {
	bsModalRef: BsModalRef;

	constructor(public modalService: BsModalService) {
		super(modalService);
	}

	openViewModal(hasDifferences: boolean, schema: string, table: string) {
		const config = {
			animated: true,
			class: 'modal-large modal-dialog-scrollable',
			initialState: {
				hasDifferences: hasDifferences,
				schema: schema,
				table: table
			}
		};

		this.bsModalRef = this.modalService.show(DiffModalComponent, config);
	}
}
