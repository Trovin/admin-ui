import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
import { DropdownItemPickerModel } from '@components/ui/dropdown-item-picker/dropdown-item-picker.model';

import { DidixOperationsService } from '@rest/didix-operations/didix-operations.service';
import { DidixOperationsLuProductResponseDto } from '@rest/didix-operations/lu-product-response.dto';
import { DidixOperationsLuContentTypeResponseDto } from '@rest/didix-operations/lu-content-type-response.dto';
import { DidixOperationsUpdateProductRequestDto } from '@rest/didix-operations/update-product-orchestration-request.dto';

@Component({
	selector: 'create-modal',
	templateUrl: './create-modal.html',
	providers: [DidixOperationsService]
})

export class DidixOperationsUpdateProductOrchestrationCreateModalComponent implements OnInit, OnDestroy {
	@Input() title: string;
	@Input() dto: DidixOperationsLuProductResponseDto;
	@Input() action: ModalActionsEnum;

	private subj = new Subscription();

	modalActions = ModalActionsEnum;
	submitted = false;
	errorMessage = '';
	loadingContentTypes = false;
	confirmed = new Subject<DidixOperationsUpdateProductRequestDto>();
	contentTypesSubj = new Subject<DropdownItemPickerModel[]>();

	form: FormGroup;

	constructor(
		public bsModalRef: BsModalRef,
		private formBuilder: FormBuilder,
		private service: DidixOperationsService
	) {
		this.createForm();
	}

	ngOnInit() {
		const model = new DidixOperationsUpdateProductRequestDto({
			operation: this.action,
			...this.dto
		});
		this.form.patchValue(model);
		this.initContentTypes();
	}

	submit() {
		if(this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.confirmed.next(this.form.getRawValue());
	}

	changedContentType(value: string) {
		this.form.patchValue({contentTypeId: value});
	}

	changeBoxSetyn(value: boolean) {
		this.form.patchValue({boxsetyn: value ? 1 : 0});
	}

	changeDiscontinuedyn(value: boolean) {
		this.form.patchValue({discontinuedyn: value ? 1 : 0});
	}

	changePrepaidyn(value: boolean) {
		this.form.patchValue({prepaidyn: value ? 1 : 0});
	}

	ngOnDestroy() {
		this.subj.unsubscribe();
	}

	decline() {
		this.confirmed.next(null);
		this.closeModal();
	}

	toggleSubmit(status: boolean) {
		this.submitted = status;
	}

	closeModal() {
		this.confirmed.complete();
		this.bsModalRef.hide();
		this.subj.unsubscribe();
	}

	private initContentTypes() {
		this.loadingContentTypes = true;

		this.service
			.getLuContentTypes()
			.subscribe(
				resp => {
					this.loadingContentTypes = false;
					const list = this.composeDropdownList(resp);

					this.contentTypesSubj.next(list);
					this.contentTypesSubj.complete();
				},
				() => this.loadingContentTypes = false
			);
	}
	private composeDropdownList(items: DidixOperationsLuContentTypeResponseDto[]): DropdownItemPickerModel[] {
		return items.map((item) => {
			return new DropdownItemPickerModel({
				name: item.contentTypeDesc,
				value: item.contenttypeId,
				checked: this.dto.contentTypeDesc === item.contentTypeDesc
			});
		});
	}

	private createForm() {
		this.form = this.formBuilder.group({
			operation: ['', Validators.required],
			productDesc: ['', Validators.required],
			productId: [''],
			contentTypeId: ['', Validators.required],
			sortId: ['', Validators.required],
			boxsetyn: [0],
			discontinuedyn: [0],
			prepaidyn: [0],
			countryId: ['', [Validators.required, Validators.maxLength(2)]],
			image: ['', Validators.required],
			currencyId: ['', [Validators.required, Validators.maxLength(3)]],
			edit: [false]
		});
	}
}
