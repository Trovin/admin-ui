import { Injectable } from '@angular/core';

import { Subject, Observable } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { AuditFileCountDto } from '@rest/audit-files-count';
import { ConfirmModalComponent } from './confirm/confirm-modal.component';

@Injectable()
export class ModalsService {
	bsModalRef: BsModalRef;

	constructor(private modalService: BsModalService) {}

	openConfirmActionPerPageModal(message: string, fileCount: AuditFileCountDto): Subject<boolean> {
		const config = {
			initialState: {
				message: message,
				fileCount: fileCount
			}
		};

		this.bsModalRef = this.modalService.show(ConfirmModalComponent, config);
		return this.bsModalRef.content.confirmed;
	}

	openConfirmAllModal(message: string, fileCountObserve: Observable<AuditFileCountDto>): Subject<boolean> {
		const config = {
			initialState: {
				message: message,
				fileCountObserve: fileCountObserve
			}
		};

		this.bsModalRef = this.modalService.show(ConfirmModalComponent, config);
		return this.bsModalRef.content.confirmed;
	}
}
