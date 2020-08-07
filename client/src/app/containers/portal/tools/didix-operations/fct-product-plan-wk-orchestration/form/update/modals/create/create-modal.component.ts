import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
import { IDidixOperationsFctProductPlanColumnResponseDto } from '@rest/didix-operations/fct-product-plan-response.dto';
import { DidixOperationsFctProductPlanUpdateRequestDto } from '@rest/didix-operations/fct-product-plan-update-request.dto';

@Component({
	selector: 'create-modal',
	templateUrl: './create-modal.html'
})

export class DidixOperationsFctProductPlanWkOrchestrationFormUpdateModalComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('planAmt', { read: ElementRef}) planAmt: ElementRef;
	@ViewChild('targetAmt', { read: ElementRef}) targetAmt: ElementRef;

	@Input() title: string;
	@Input() dto: IDidixOperationsFctProductPlanColumnResponseDto;
	@Input() action: ModalActionsEnum;
	@Input() fiscalYearId = null;

	private subj = new Subscription();

	modalActions = ModalActionsEnum;
	submitted = false;
	errorMessage = '';
	confirmed = new Subject<DidixOperationsFctProductPlanUpdateRequestDto>();

	form: FormGroup;

	constructor(
		public bsModalRef: BsModalRef,
		private formBuilder: FormBuilder
	) {
		this.createForm();
	}

	ngOnInit() {
		const model = new DidixOperationsFctProductPlanUpdateRequestDto({
			operation: this.action,
			weekId: this.dto.weekId,
			productId: this.dto.productId,
			planAmount: this.dto.planAmount,
			targetAmount: this.dto.targetAmount,
			fiscalYearId: this.dto.fiscalYearId
		});

		this.form.patchValue(model, {emitEvent: false, onlySelf: true});
	}

	ngAfterViewInit() {
		/*
			Hack for type="number". Input type="number" is changing value inside.
			If you type .50 it change it to 0.50 inside. After patchValue type="number" doesn't change.
			Reactive form do not trigger dispatchEvent after patchValue
		**/
		this.planAmt.nativeElement.dispatchEvent(new Event('change'));
		this.targetAmt.nativeElement.dispatchEvent(new Event('change'));
	}

	submit() {
		if(this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.confirmed.next(this.form.getRawValue());
	}

	ngOnDestroy() {
		this.subj.unsubscribe();
	}

	decline() {
		this.confirmed.next(null);
		this.closeModal();
	}

	reset() {
		this.form.reset();
	}

	toggleSubmit(status: boolean) {
		this.submitted = status;
	}

	closeModal() {
		this.confirmed.complete();
		this.bsModalRef.hide();
		this.subj.unsubscribe();
	}

	private createForm() {
		this.form = this.formBuilder.group({
			weekId: [''],
			productId: [''],
			planAmount: ['', [Validators.required, Validators.pattern(/^[0-9]\d*(\.\d{1,2})?$/)]],
			targetAmount: ['', Validators.pattern(/^[0-9]\d*(\.\d{1,2})?$/)],
			fiscalYearId: [null, Validators.required]
		});
	}
}
