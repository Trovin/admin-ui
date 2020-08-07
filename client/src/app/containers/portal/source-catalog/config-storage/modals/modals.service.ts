import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import { BaseModalsService, IViewModal } from '@components/ui/modal-v2/modal-v2.service';

import { CreatedFile } from './../shared/created-file.dto';

import { ConfigStorageGenerateConfigModalComponent } from './generate-config/generate-config.component';

@Injectable()
export class ModalsService extends BaseModalsService implements IViewModal {
	constructor(public modalService: BsModalService) {
		super(modalService);
	}

	openViewModal() {
		this.bsModalRef = this.modalService.show(ConfigStorageGenerateConfigModalComponent, {});
		return this.bsModalRef.content.confirmed;
	}

	toggleSubmit(status: boolean) {
		this.bsModalRef.content.toggleSubmit(status);
	}
}
