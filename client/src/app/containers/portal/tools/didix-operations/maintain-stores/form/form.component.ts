import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';

import { DropdownItemPickerModel } from '@components/ui/dropdown-item-picker/dropdown-item-picker.model';
import { DropdownItemPickerComponent } from '@components/ui/dropdown-item-picker/dropdown-item-picker.component';

import { DidixOperationsService } from '@rest/didix-operations/didix-operations.service';
import { DidixOperationsLuStoreResponseDto } from '@rest/didix-operations/lu-store-response.dto';

@Component({
	selector: 'fct-product-plan-wk-orchestration-form',
	templateUrl: './form.html',
	providers: [
		DidixOperationsService
	]
})

export class DidixOperationsMaintainStoresFormComponent implements AfterViewInit {
	@ViewChild('channelsList', { static: true }) channelsList: DropdownItemPickerComponent;

	private jobAliasName = 'update-lu-store';

	channelsSubj = new Subject<DropdownItemPickerModel[]>();

	form: FormGroup;

	loadingChannels = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private service: DidixOperationsService
	) {
		this.createForm();
	}

	ngAfterViewInit() {
		this.initChannels();
	}

	changedChannels(value: number) {
		this.form.patchValue({channel: value});
	}

	goToBack() {
		 this.router.navigate(['/portal/tools/didix-operations']);
	}

	submit() {
		if(this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const formData = this.form.getRawValue();
		const queryParams: NavigationExtras = {
			queryParams: {
				'channel': formData.channel
			},
			relativeTo: this.route,
			replaceUrl: true
		};
		this.router.navigate(['update'], queryParams);
	}

	reset() {
		this.form.patchValue({amount: '', weekId: null});
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
				value: item
			});
		});
	}

	private createForm() {
		this.form = this.formBuilder.group({
			channel: ['', Validators.required]
		});
	}
}
