import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
import { CloudWatchWidgetImageModel } from '@containers/portal/dashboard/widgets/cloud-watch/widget-image/widget-image.model';

import { CloudWatchWidgetCreateModalComponent } from './create/create-modal.component';

export interface IModalCreateData {
	title: string;
	action: ModalActionsEnum;
	item?: CloudWatchWidgetImageModel;
}

@Injectable()
export class ModalsService {
	bsModalRef: BsModalRef;

	constructor(private modalService: BsModalService) {}

	open(data: IModalCreateData): Subject<boolean> {
		const className = data.action !== ModalActionsEnum.DELETE ? 'modal-lg' : '';
		const config = {
			ignoreBackdropClick: true,
			animated: true,
			class: className,
			initialState: {
				item: data.item,
				action: data.action,
				title: data.title
			}
		};

		this.bsModalRef = this.modalService.show(CloudWatchWidgetCreateModalComponent, config);

		return this.bsModalRef.content.confirmed;
	}
}
