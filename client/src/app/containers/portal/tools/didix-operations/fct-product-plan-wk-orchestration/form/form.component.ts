import { Component, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

import { Subscription, Subject } from 'rxjs';

import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';

import { UserService } from '@core/user/user.service';

import { PaginationService } from '@containers/shared/pagination.service';

import { HttpStatuses } from '@enums/http-statuses.enum';

import { DropdownItemPickerModel } from '@components/ui/dropdown-item-picker/dropdown-item-picker.model';
import { DropdownItemPickerComponent } from '@components/ui/dropdown-item-picker/dropdown-item-picker.component';

import { DidixOperationsService } from '@rest/didix-operations/didix-operations.service';
import { DidixOperationsProductResponseDto } from '@rest/didix-operations/product-response.dto';

@Component({
	selector: 'fct-product-plan-wk-orchestration-form',
	templateUrl: './form.html',
	providers: [
		PaginationService,
		DidixOperationsService
	]
})

export class DidixOperationsFctProductPlanWkOrchestrationFormComponent implements AfterViewInit, OnDestroy {
	@ViewChild('productsList', { static: true }) productsList: DropdownItemPickerComponent;
	@ViewChild('salesYearsList', { static: true }) salesYearsList: DropdownItemPickerComponent;
	@ViewChild('creditorsList', { static: true }) creditorsList: DropdownItemPickerComponent;
	@ViewChild('bsDp', { static: true }) bsDp: BsDatepickerDirective;

	private sub = new Subscription();
	private jobAliasName = 'fct_product_plan_wk_orchestration';

	productsSubj = new Subject<DropdownItemPickerModel[]>();
	salesYearsSubj = new Subject<DropdownItemPickerModel[]>();

	form: FormGroup;
	httpStatuses = HttpStatuses;

	items = [];
	years = [];

	loading = false;
	loadingArticles = false;
	loadingProducts = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private userService: UserService,
		private formBuilder: FormBuilder,
		private service: DidixOperationsService
	) {
		this.createForm();
	}

	ngAfterViewInit() {
		this.initProducts();
		this.years = this.composeSalesYearsDropdownList(this.generateYears());
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	changedSalesYear(value: number) {
		this.form.patchValue({fiscalYearId: value});
	}

	changedProduct(data: DropdownItemPickerModel) {
		this.form.patchValue({productId: data.value['name'], currencyId: data.value['currencyId'], productDesc: data.name});
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
				'fiscalYearId': formData.fiscalYearId,
				'productName': formData.productDesc,
				'currencyId': formData.currencyId
			},
			relativeTo: this.route,
			replaceUrl: true
		};
		this.router.navigate(['update'], queryParams);
	}

	reset() {
		this.form.patchValue({amount: '', weekId: null});
	}

	private initProducts() {
		this.loadingProducts = true;

		this.service
			.getProducts(this.jobAliasName)
			.subscribe(
				resp => {
					this.loadingProducts = false;
					const list = this.composeProductsDropdownList(resp);

					this.productsSubj.next(list);
					this.productsSubj.complete();
				},
				() => this.loadingProducts = false
			);
	}

	private generateYears() {
		const years = [];
		let dateStart = new Date(2018, 0).getFullYear();
		const dateEnd = new Date().getFullYear();

		while(dateEnd - dateStart >= -1) {
			years.push(dateStart);
			dateStart += 1;
		}

		return years;
	}

	private composeSalesYearsDropdownList(items: number[]): DropdownItemPickerModel[] {
		return items.map((item) => {
			return new DropdownItemPickerModel({
				name: `${item}`,
				value: item
			});
		});
	}

	private composeProductsDropdownList(items: DidixOperationsProductResponseDto[]): DropdownItemPickerModel[] {
		return items.map((item) => {
			return new DropdownItemPickerModel({
				name: item.productDesc,
				value: {
					name: item.productId,
					currencyId: item.currencyId
				}
			});
		});
	}

	private createForm() {
		this.form = this.formBuilder.group({
			fiscalYearId: ['', Validators.required],
			productId: ['', Validators.required],
			currencyId: [''],
			productDesc: ['']
		});
	}
}
