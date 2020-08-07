import { Component, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';

import { Subscription, Subject } from 'rxjs';

import { BsModalRef } from 'ngx-bootstrap/modal';

import * as moment from 'moment';

import { HttpStatuses } from '@enums/http-statuses.enum';

import { ParamsService } from './../../shared/params.service';

import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
import { FormValidationService } from '@components/ui/form-message/form-validation.service';
import { DropdownItemPickerModel } from '@components/ui/dropdown-item-picker/dropdown-item-picker.model';

import { DidixOperationsService } from '@rest/didix-operations/didix-operations.service';
import { DidixOperationsDebtorResponseDto } from '@rest/didix-operations/debtor-response.dto';
import { DidixOperationsLuCardResponseDto } from '@rest/didix-operations/lu-card-response.dto';
import { DidixOperationsArticleRequestDto } from '@rest/didix-operations/articles-request.dto';
import { DidixOperationsArticleResponseDto } from '@rest/didix-operations/article-response.dto';
import { DidixOperationsProductResponseDto } from '@rest/didix-operations/product-response.dto';
import { DidixOperationsCreateManualCardRequestDto } from '@rest/didix-operations/create-manual-card-orchestration-request.dto';
import { BaseParamsModel } from './../../shared/params-base.model';

@Component({
	selector: 'create-manual-card-orchestration',
	templateUrl: './create-modal.html',
	providers: [
		ParamsService,
		DidixOperationsService
	]
})
export class DidixOperationsCreateManualCardOrchestrationModalComponent implements AfterViewInit, OnDestroy {
	@Input() action: ModalActionsEnum;
	@Input() title: string;
	@Input() dto: DidixOperationsLuCardResponseDto;
	@Input() createDto: BaseParamsModel;

	private sub = new Subscription();

	articlesSubj = new Subject<DropdownItemPickerModel[]>();
	debtorsSubj = new Subject<DropdownItemPickerModel[]>();
	productsSubj = new Subject<DropdownItemPickerModel[]>();

	form: FormGroup;
	httpStatuses = HttpStatuses;
	modalActions = ModalActionsEnum;
	confirmed = new Subject<DidixOperationsCreateManualCardRequestDto>();

	jobAliasName = 'generate-config-manual-card-orchestration';
	loading = false;
	submitted = false;
	loadingDebtors = false;
	loadingProducts = false;
	loadingArticles = false;

	constructor(
		public bsModalRef: BsModalRef,
		private router: Router,
		private location: Location,
		private formBuilder: FormBuilder,
		public service: DidixOperationsService
	) {
		this.createForm();
	}

	ngAfterViewInit() {
		const model = new DidixOperationsCreateManualCardRequestDto({
			operation: this.action,
			article: this.dto.article,
			debtor: this.dto.debtor,
			salesPrice: this.dto.salesPrice,
			salesDate: this.dto.salesDateId ? moment(this.dto.salesDateId).format('YYYY-MM-DD') : null,
			productId: this.dto.productId,
			salesTime: '00:00:00',
			code: this.dto.code
		});

		this.form.patchValue(model);

		if(this.action !== this.modalActions.DELETE) {
			this.initProducts();
			this.initDebtors();
		}
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	goToBack() {
		this.router.navigate(['/portal/tools/didix-operations']);
	}

	changedArticle(value: string) {
		this.form.patchValue({article: value});
	}

	changedProduct(value: number) {
		this.form.patchValue({productId: value});
		this.initArticles(value);
	}

	changedDebtor(value: string) {
		this.form.patchValue({debtor: value});
	}

	closeModal() {
		this.confirmed.complete();
		this.bsModalRef.hide();
		this.sub.unsubscribe();
	}

	submit() {
		this.submitted = true;

		if(this.form.invalid && this.action !== ModalActionsEnum.DELETE) {
			this.submitted = false;
			this.form.markAllAsTouched();
			return;
		}

		const salesDate = this.form.get('salesDate').value ? moment(this.form.get('salesDate').value).format('MM/DD/YYYY') : null;
		const data = Object.assign({}, this.form.getRawValue(), {salesDate});
		this.confirmed.next(data);
	}

	reset() {
		this.form.reset();
	}

	private initProducts() {
		this.loadingProducts = true;

		this.service
			.getProducts(this.jobAliasName)
			.subscribe(
				resp => {
					this.loadingProducts = false;
					const list = this.composeProductsDropdownList(resp);
					const productData = list.filter(e => e.checked )[0];
					const productId = productData ? productData.value as number : null;
					this.initArticles(productId);

					this.productsSubj.next(list);
					this.productsSubj.complete();
				},
				() => this.loadingProducts = false
			);
	}

	private initArticles(productId: number) {
		this.loadingArticles = true;

		if(!productId) {
			this.loadingArticles = false;
			return;
		}

		const requestDto = new DidixOperationsArticleRequestDto({productId: productId});
		this.service
			.getArticles(requestDto)
			.subscribe(
				resp => {
					this.loadingArticles = false;
					const list = this.composeArticlesDropdownList(resp);

					this.articlesSubj.next(list);
				},
				() => this.loadingArticles = false
			);
	}

	private composeArticlesDropdownList(items: DidixOperationsArticleResponseDto[]): DropdownItemPickerModel[] {
		return items.map((item) => {
			return new DropdownItemPickerModel({
				name: `${item.articleDesc}`,
				value: item.article,
				checked: this.form.get('article').value === item.article
			});
		});
	}

	private initDebtors() {
		this.loadingDebtors = true;

		this.service
			.getDebtors()
			.subscribe(
				resp => {
					this.loadingDebtors = false;
					const list = this.composeDebtorDropdownList(resp);
					const data = list.filter(e => e.checked)[0];
					this.form.patchValue({debtor: data ? data.value : null});

					this.debtorsSubj.next(list);
					this.debtorsSubj.complete();
				},
				() => this.loadingDebtors = false
			);
	}

	private composeDebtorDropdownList(items: DidixOperationsDebtorResponseDto[]): DropdownItemPickerModel[] {
		return items.map((item) => {
			return new DropdownItemPickerModel({
				name: `${item.debtorDesc}`,
				value: item.debtorId,
				checked: this.form.get('debtor').value ? this.form.get('debtor').value === item.debtorId : item.debtorDesc === 'Unknown'
			});
		});
	}

	private composeProductsDropdownList(items: DidixOperationsProductResponseDto[]): DropdownItemPickerModel[] {
		return items.map((item) => {
			return new DropdownItemPickerModel({
				name: `${item.productDesc}`,
				value: item.productId,
				checked: this.form.get('productId').value === item.productId
			});
		});
	}


	private createForm() {
		this.form = this.formBuilder.group({
			operation: [null],
			article: [null, Validators.required],
			productId: [null, Validators.required],
			salesPrice: [null, [Validators.required, Validators.pattern(/^[0-9]\d*(\.\d{1,2})?$/)]],
			salesDate: [null, [Validators.required, FormValidationService.getDateValidator('MM/DD/YYYY')]],
			salesTime: ['00:00:00'],
			debtor: [null, Validators.required],
			code: [null]
		});
	}
}
