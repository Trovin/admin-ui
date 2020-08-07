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
import { DidixOperationsArticleRequestDto } from '@rest/didix-operations/articles-request.dto';
import { DidixOperationsArticleResponseDto } from '@rest/didix-operations/article-response.dto';
import { DidixOperationsProductResponseDto } from '@rest/didix-operations/product-response.dto';
import { DidixOperationsCreateManualCardRequestDto } from '@rest/didix-operations/create-manual-card-orchestration-request.dto';
import { DidixOperationsCreditorResponseDto } from '@rest/didix-operations/creditor-response.dto';
import { DidixOperationsLuTransactionResponseDto } from '@rest/didix-operations/lu-transaction-response.dto';
import { DidixOperationsCreateManualTxnRequestDto } from '@rest/didix-operations/create-manual-txn-orchestration-request.dto';

@Component({
	selector: 'create-manual-card-orchestration',
	templateUrl: './create-modal.html',
	providers: [
		ParamsService,
		DidixOperationsService
	]
})
export class DidixOperationsCreateManualTxnOrchestrationModalComponent implements AfterViewInit, OnDestroy {
	@Input() action: ModalActionsEnum;
	@Input() title: string;
	@Input() dto: DidixOperationsLuTransactionResponseDto;

	private sub = new Subscription();

	articlesSubj = new Subject<DropdownItemPickerModel[]>();
	creditorsSubj = new Subject<DropdownItemPickerModel[]>();
	productsSubj = new Subject<DropdownItemPickerModel[]>();

	form: FormGroup;
	httpStatuses = HttpStatuses;
	modalActions = ModalActionsEnum;
	confirmed = new Subject<DidixOperationsCreateManualCardRequestDto>();

	jobAliasName = 'generate-config-manual-txn-orchestration';
	loading = false;
	submitted = false;
	loadingCreditors = false;
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
		const model = new DidixOperationsCreateManualTxnRequestDto({
			operation: this.action,
			article: this.dto.article,
			redeemAmt: this.dto.redeemAmt,
			redeemDate: this.dto.redeemDate ? moment(this.dto.redeemDate).format('YYYY-MM-DD') : null,
			productId: this.dto.productId,
			creditor: this.dto.creditor,
			code: this.dto.code
		});

		this.form.patchValue(model);

		if(this.action !== this.modalActions.DELETE) {
			this.initProducts();
			this.initCreditors();
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

	changedCreditor(value: string) {
		this.form.patchValue({creditor: value});
	}

	changeRedeemDate(date: Date) {
		this.form.patchValue({redeemDate: date});
	}

	reset() {
		this.form.reset();
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

		const redeemDate = this.form.get('redeemDate').value ? moment(this.form.get('redeemDate').value).format('MM/DD/YYYY') : null;
		const data = Object.assign({}, this.form.getRawValue(), {redeemDate});
		this.confirmed.next(data);
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

	private initCreditors() {
		this.loadingCreditors = true;

		this.service
		.getCreditor()
		.subscribe(
			resp => {
				this.loadingCreditors = false;
				const list = this.composeCreditorDropdownList(resp);
				const data = list.filter(e => e.checked)[0];
				this.form.patchValue({creditor: data ? data.value : null});

				this.creditorsSubj.next(list);
				this.creditorsSubj.complete();
			},
			() => this.loadingCreditors = false
		);
	}

	private composeCreditorDropdownList(items: DidixOperationsCreditorResponseDto[]): DropdownItemPickerModel[] {
		return items.map((item) => {
			return new DropdownItemPickerModel({
				name: item.creditorDesc,
				value: item.creditorId,
				checked: this.form.get('creditor').value ? this.form.get('creditor').value === item.creditorId : item.creditorDesc === 'Unknown'
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
			article: ['', Validators.required],
			productId: ['', Validators.required],
			redeemAmt: ['', [Validators.required, Validators.pattern(/^[0-9]\d*(\.\d{1,2})?$/)]],
			redeemDate: ['', [Validators.required,  FormValidationService.getDateValidator('MM/DD/YYYY')]],
			creditor: ['', Validators.required],
			code: ['']
		});
	}
}
