import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ModalEventType } from '@enums/modal-event-type';

import { S3BucketDto } from '@rest/aws/s3/bucket-list/index';
import { AlarmConfigDto, AlarmConfigUpdateQueriesDto, AlarmConfigCreateQueriesDto } from '@rest/alarm-config/index';

import { ConfirmModalComponent } from './confirm/confirm-modal.component';
import { ActionModalComponent } from './action/action-modal.component';

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

	openEditModal(config: AlarmConfigDto, bucketList: S3BucketDto[]): Subject<AlarmConfigUpdateQueriesDto> {
		const subj = new Subject<AlarmConfigUpdateQueriesDto>();
		const params = {
			ignoreBackdropClick: true,
			initialState: {
				bucketListData: bucketList,
				config: config,
				textControlBtn: 'Save',
				title: 'Edit config',
				isEditMode: true
			}
		};

		this.bsModalRef = this.modalService.show(ActionModalComponent, params);

		this.bsModalRef.content.updateConfigSubj.subscribe(config => {
			subj.next(config);
			subj.complete();
		});

		return subj;
	}

	openCopyModal(config: AlarmConfigDto, bucketList: S3BucketDto[]): Subject<AlarmConfigCreateQueriesDto> {
		const subj = new Subject<AlarmConfigCreateQueriesDto>();
		const params = {
			ignoreBackdropClick: true,
			initialState: {
				bucketListData: bucketList,
				config: config,
				textControlBtn: 'Copy',
				title: 'Copy config',
				isCopyMode: true
			}
		};

		this.bsModalRef = this.modalService.show(ActionModalComponent, params);

		this.bsModalRef.content.createConfigSubj.subscribe(config => {
			subj.next(config);
			subj.complete();
		});

		return subj;
	}

	openCreateModal(bucketList: S3BucketDto[]): Subject<AlarmConfigDto> {
		const subj = new Subject<AlarmConfigDto>();
		const config = {
			ignoreBackdropClick: true,
			initialState: {
				bucketListData: bucketList,
				textControlBtn: 'Create',
				title: 'Create config'
			}
		};

		this.bsModalRef = this.modalService.show(ActionModalComponent, config);

		this.bsModalRef.content.createConfigSubj.subscribe(config => {
			subj.next(config);
			subj.complete();
		});

		return subj;
	}
}
