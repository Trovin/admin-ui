import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';

import {
	DropdownItemPickerModel,
	DropdownItemPickerModelValue
} from '@components/ui/dropdown-item-picker/dropdown-item-picker.model';
import { DropdownItemPickerComponent } from '@components/ui/dropdown-item-picker/dropdown-item-picker.component';

import { DidixOperationsService } from '@rest/didix-operations/didix-operations.service';
import { DidixOperationsLuProductResponseDto } from '@rest/didix-operations/lu-product-response.dto';

@Component({
	selector: 'maintain-article-form',
	templateUrl: './form.html',
	providers: [
		DidixOperationsService
	]
})

export class DidixOperationsMaintainArticlesFormComponent implements AfterViewInit {
	@ViewChild('channelsList', { static: true }) channelsList: DropdownItemPickerComponent;

	channelsSubj = new Subject<DropdownItemPickerModel[]>();
	form: FormGroup;
	loading = false;

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

	changedProduct(value: DropdownItemPickerModelValue) {
		this.form.patchValue({
			productId: value.value,
			productDesc: value.name
		});
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
				'productId': formData.productId,
				'productDesc': formData.productDesc

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
		this.loading = true;

		this.service
			.getLuProducts()
				.subscribe(
					resp => {
						this.loading = false;
						const list = this.composeChannelsDropdownList(resp);

						this.channelsSubj.next(list);
						this.channelsSubj.complete();
					},
					() => this.loading = false
				);
	}

	private composeChannelsDropdownList(items: DidixOperationsLuProductResponseDto[]): DropdownItemPickerModel[] {
		return items.map((item) => {
			return new DropdownItemPickerModel({
				name: `${item.productDesc}`,
				value: item.productId
			});
		});
	}

	private createForm() {
		this.form = this.formBuilder.group({
			productId: [Validators.required],
			productDesc: [Validators.required]
		});
	}
}
