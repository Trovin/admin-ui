import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ModalEventType } from '@enums/modal-event-type';

import { ConfirmationComponent } from '@components/ui/confirmation/confirmation.component';

import { S3BucketFileDto } from '@rest/aws/s3/bucket-files';
import { S3BucketFilesExecuteDto, S3BucketFilesExecuteQueriesDto } from '@rest/aws/s3/bucket-files-execute';

import { AutoConfigModel } from './../pipelines-configs.models';

import { ExecuteModalComponent } from './execute/execute-modal.component';
import { ErrorModalComponent } from './error/error-modal.component';

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

	openIgnoreErrorsModal(data: S3BucketFilesExecuteDto[]): Subject<boolean> {
		const subj = new Subject<boolean>();

		const events = [ModalEventType.DECLINE, ModalEventType.ESC, ModalEventType.BACKDROPCLICK];
		const config = {
			class: 'modal-md',
			animated: true,
			initialState: {
				filesWithErrors: data
			}
		};

		this.bsModalRef = this.modalService.show(ErrorModalComponent, config);
		this.bsModalRef.content.confirmed
			.subscribe((e: string) => {
				const evenType = ModalEventType.getByAlias(e);
				const status = !!evenType && !~events.indexOf(evenType);

				subj.next(status);
				subj.complete();
			});

		return subj;
	}

	openExecuteModal(configs: AutoConfigModel[], templates: S3BucketFileDto[]): Subject<S3BucketFilesExecuteQueriesDto[]> {
		const subj = new Subject<S3BucketFilesExecuteQueriesDto[]>();
		const params = {
			ignoreBackdropClick: true,
			initialState: {
				templatesListData: templates,
				configs: configs
			}
		};

		this.bsModalRef = this.modalService.show(ExecuteModalComponent, params);

		this.bsModalRef.content.executeSubj.subscribe(queries => {
			subj.next(queries);
			subj.complete();
		});

		return subj;
	}
}
