import { Component, ViewEncapsulation } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { ModalEventType } from '@enums/modal-event-type';

import { S3BucketFilesExecuteDto } from '@rest/aws/s3/bucket-files-execute';

@Component({
	selector: 'error-modal',
	templateUrl: './error-modal.html',
	encapsulation: ViewEncapsulation.None
})

export class ErrorModalComponent {
	confirmed = new Subject<string>();
	filesWithErrors: S3BucketFilesExecuteDto[] = [];

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
