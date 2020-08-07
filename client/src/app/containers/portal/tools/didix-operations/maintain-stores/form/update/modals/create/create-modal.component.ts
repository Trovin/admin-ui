import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
import { FormValidationService } from '@components/ui/form-message/form-validation.service';
import { DropdownItemPickerModel } from '@components/ui/dropdown-item-picker/dropdown-item-picker.model';

import { DidixOperationsService } from '@rest/didix-operations/didix-operations.service';
import { DidixOperationsLuStoreResponseDto } from '@rest/didix-operations/lu-store-response.dto';
import { DidixOperationsLuStoreUpdateRequestDto } from '@rest/didix-operations/lu-store-update-request.dto';

@Component({
	selector: 'maintain-stores-form-update-modal',
	templateUrl: './create-modal.html',
	providers: [
		DidixOperationsService
	]
})
export class DidixOperationsMaintainStoresFormUpdateModalComponent implements OnInit, OnDestroy {
	@Input() title: string;
	@Input() dto: DidixOperationsLuStoreResponseDto;
	@Input() action: ModalActionsEnum;

	private subj = new Subscription();

	form: FormGroup;
	modalActions = ModalActionsEnum;
	channelsSubj = new Subject<DropdownItemPickerModel[]>();
	confirmed = new Subject<DidixOperationsLuStoreUpdateRequestDto>();

	submitted = false;
	loadingChannels = false;

	constructor(
		public bsModalRef: BsModalRef,
		private formBuilder: FormBuilder,
		private service: DidixOperationsService
	) {
		this.createForm();
	}

	ngOnInit() {
		const model = new DidixOperationsLuStoreUpdateRequestDto({
			operation: this.action,
			channel: this.dto.channel,
			storeId: this.dto.storeId,
			storeDesc: this.dto.storeDesc,
			city: this.dto.city,
			postalCode: this.dto.postalCode,
			countryId: this.dto.countryId,
			b2b: this.dto.b2b
		});

		this.form.patchValue(model);
		this.initChannels();
	}

	changedChannel(value: number) {
		this.form.patchValue({channel: value});
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

	private initChannels() {
		this.loadingChannels = true;

		this.service
			.getLuStoreChannels()
			.subscribe(
				resp => {
					this.loadingChannels = false;
					const list = this.composeChannelsDropdownList(resp);

					this.channelsSubj.next(list);
					this.channelsSubj.complete();
				},
				() => this.loadingChannels = false
			);
	}

	private composeChannelsDropdownList(items: string[]): DropdownItemPickerModel[] {
		return items.map((item) => {
			return new DropdownItemPickerModel({
				name: `${item}`,
				value: item,
				checked: this.dto.channel === item
			});
		});
	}

	private createForm() {
		this.form = this.formBuilder.group({
			operation: ['', Validators.required],
			storeId: ['', [Validators.required, Validators.maxLength(50)]],
			storeDesc: ['', Validators.required],
			city: ['', Validators.required],
			postalCode: ['', [Validators.required, Validators.maxLength(25)]],
			countryId: ['', [Validators.required, Validators.maxLength(2)]],
			b2b: ['', [Validators.required, FormValidationService.geStringValidator(['Y', 'N'])]],
			channel: ['', Validators.required]
		});
	}
}
