import { Component, Input, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
import { DropdownItemPickerModel } from '@components/ui/dropdown-item-picker/dropdown-item-picker.model';

import { DidixOperationsService } from '@rest/didix-operations/didix-operations.service';
import { DidixOperationsLuChannelResponseDto } from '@rest/didix-operations/lu-channel-response.dto';
import { DidixOperationsLuChannelUpdateRequestDto } from '@rest/didix-operations/lu-channel-update-request.dto';

@Component({
	selector: 'create-modal',
	templateUrl: './create-modal.html',
	providers: [DidixOperationsService]
})

export class DidixOperationsMaintainChannelModalComponent implements OnInit, OnDestroy, AfterViewInit {
	@Input() title: string;
	@Input() dto: DidixOperationsLuChannelResponseDto;
	@Input() action: ModalActionsEnum;

	private subj = new Subscription();

	channelsSubj = new Subject<DropdownItemPickerModel[]>();
	confirmed = new Subject<DidixOperationsLuChannelUpdateRequestDto>();

	form: FormGroup;
	modalActions = ModalActionsEnum;
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
		const model = new DidixOperationsLuChannelUpdateRequestDto({
			operation: this.action,
			channel: this.dto.channel,
			channelLogo: this.dto.channelLogo,
			code2: this.dto.code2,
			code3: this.dto.code3
		});

		this.form.patchValue(model);
	}

	ngAfterViewInit() {
		this.initChannels();
	}

	ngOnDestroy() {
		this.subj.unsubscribe();
	}

	submit() {
		if(this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.confirmed.next(this.form.getRawValue());
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
				name: item,
				value: item,
				checked: this.dto.channel === item
			});
		});
	}

	private createForm() {
		this.form = this.formBuilder.group({
			operation: ['', Validators.required],
			channel: ['', Validators.required],
			channelLogo: ['', Validators.required],
			code2: ['', [Validators.maxLength(2)]],
			code3: ['', [Validators.maxLength(3)]]
		});
	}
}
