import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription, Observable } from 'rxjs';

type FileCountType = {
	errorsCount: number;
	successCount: number;
};

@Component({
	selector: 'confirm-modal',
	templateUrl: './confirm-modal.html'
})

export class ConfirmModalComponent implements OnInit, OnDestroy {
	@Input() fileCountObserve: Observable<FileCountType>;
	@Input() fileCount: FileCountType;
	@Input() message: string;

	isLoadingFilesCount = false;
	confirmed = new Subject<boolean>();

	private subj = new Subscription();

	constructor( public bsModalRef: BsModalRef ) {}

	ngOnInit() {
		if(this.fileCountObserve) {
			this.composeFileCount();
		}
	}

	ngOnDestroy() {
		this.subj.unsubscribe();
	}

	confirm() {
		this.confirmed.next(true);
		this.closeModal();
	}

	decline() {
		this.confirmed.next(false);
		this.closeModal();
	}

	private closeModal() {
		this.confirmed.complete();
		this.bsModalRef.hide();
		this.subj.unsubscribe();
	}

	private composeFileCount() {
		this.isLoadingFilesCount = true;

		const sub = this.fileCountObserve.subscribe(
			r => {
				this.isLoadingFilesCount = false;

				this.fileCount = {
					errorsCount: r.errorsCount,
					successCount: r.successCount
				};
			},
			() => {
				this.isLoadingFilesCount = false;
			}
		);

		this.subj.add(sub);
	}
}
