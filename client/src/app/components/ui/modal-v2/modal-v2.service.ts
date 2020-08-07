import { Injectable } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

export interface IModalsService {
	bsModalRef: BsModalRef;
	closeModal: () => void;
}

export interface IUpdateModal {
	openUpdateModal<T>(dto: T, ...argument: any[]);
}
export interface ICreateModal {
	openCreateModal<T>(dto: T, ...argument: any[]);
}

export interface IDeleteModal {
	openDeleteModal<T>(dto: T, ...argument: any[]);
}

export interface IViewModal {
	openViewModal<T>(item: T, ...argument: any[]);
}

export interface IConfirmModal {
	openConfirmModal<T>(item: T, ...argument: any[]);
}

@Injectable()
export abstract class BaseModalsService implements IModalsService {
	bsModalRef: BsModalRef;

	protected constructor(public modalService: BsModalService) {}

	closeModal() {
		this.bsModalRef.content.closeModal();
		this.bsModalRef.content.reset();
	}
}
