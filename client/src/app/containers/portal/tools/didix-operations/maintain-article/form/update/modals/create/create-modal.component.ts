import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

import * as moment from 'moment';

import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
import { DidixOperationsLuArticleResponseDto } from '@rest/didix-operations/lu-article-response.dto';
import { DidixOperationsLuArticleUpdateRequestDto } from '@rest/didix-operations/lu-article-update-request.dto';

@Component({
	selector: 'maintain-article-form-create-modal',
	templateUrl: './create-modal.html'
})

export class DidixOperationsMaintainArticleFormUpdateComponent implements OnInit, OnDestroy {
	@Input() title: string;
	@Input() dto: DidixOperationsLuArticleResponseDto;
	@Input() action: ModalActionsEnum;

	private subj = new Subscription();

	modalActions = ModalActionsEnum;
	submitted = false;
	confirmed = new Subject<DidixOperationsLuArticleUpdateRequestDto>();

	form: FormGroup;
	errors = '';

	constructor(
		public bsModalRef: BsModalRef,
		private formBuilder: FormBuilder
	) {}

	ngOnInit() {
		this.createForm();

		const model = new DidixOperationsLuArticleUpdateRequestDto({
			operation: this.action,
			article: this.dto.article,
			articleDesc: this.dto.articleDesc,
			productId: this.dto.productId,
			productDesc: this.dto.productDesc,
			discontinued: this.dto.discontinued || 0,
			startDate: this.dto.startDate ? moment(this.dto.startDate).format('YYYY-MM-DD') : null
		});
		this.form.patchValue(model);
	}

	submit() {
		this.submitted = true;

		if(this.form.invalid && this.action !== ModalActionsEnum.DELETE) {
			this.submitted = false;
			this.form.markAllAsTouched();
			return;
		}

		const startDate = this.form.get('startDate').value ? moment(this.form.get('startDate').value).format('MM/DD/YYYY') : null;
		const data = Object.assign(this.form.getRawValue(), {startDate});
		this.confirmed.next(data);
	}

	ngOnDestroy() {
		this.subj.unsubscribe();
	}

	decline() {
		this.confirmed.next(null);
		this.closeModal();
	}

	changeDiscontinued(value: boolean) {
		this.form.patchValue({discontinued: value ? 1 : 0});
	}

	changeStartDate(date: Date) {
		this.form.patchValue({startDate: date});
	}

	toggleSubmit(status: boolean) {
		this.submitted = status;
	}

	closeModal() {
		this.confirmed.complete();
		this.bsModalRef.hide();
		this.subj.unsubscribe();
	}

	reset() {
		this.form.reset();
	}

	private createForm() {
		const articleData = {value: '', disabled: false};
		if(this.action === this.modalActions.UPDATE) {
			articleData.disabled =  true;
		}
		this.form = this.formBuilder.group({
			operation: ['', Validators.required],
			article: [articleData, [Validators.required, Validators.maxLength(50)]],
			articleDesc: ['', Validators.required],
			productId: [null],
			productDesc: [null],
			discontinued: [0],
			startDate: [null]
		});
	}
}
