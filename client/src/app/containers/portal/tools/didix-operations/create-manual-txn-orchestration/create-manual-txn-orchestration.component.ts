import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import { Subscription, Subject } from 'rxjs';

import * as moment from 'moment';

import { UserService } from '@core/user/user.service';

import { Timezone } from '@enums/timezone.enum';
import { HttpStatuses } from '@enums/http-statuses.enum';

import { alertsService } from '@components/ui/alerts/alerts.service';
import { PaginationService } from '@containers/shared/pagination.service';
import { PagerV2Service } from '@components/ui/paginator-v2/pager/pager.service';
import { PaginatorV2Service } from '@components/ui/paginator-v2/paginator.service';
import { FormValidationService } from '@components/ui/form-message/form-validation.service';
import { DropdownItemPickerModel } from '@components/ui/dropdown-item-picker/dropdown-item-picker.model';
import { DropdownItemPickerComponent } from '@components/ui/dropdown-item-picker/dropdown-item-picker.component';

import { BaseResponseDto } from '@rest/shared/base-response.dto';
import { DidixOperationsService } from '@rest/didix-operations/didix-operations.service';
import { DidixOperationsLuCardResponseDto } from '@rest/didix-operations/lu-card-response.dto';
import { DidixOperationsArticleRequestDto } from '@rest/didix-operations/articles-request.dto';
import { DidixOperationsProductResponseDto } from '@rest/didix-operations/product-response.dto';
import { DidixOperationsArticleResponseDto } from '@rest/didix-operations/article-response.dto';
import { DidixOperationsCreditorResponseDto } from '@rest/didix-operations/creditor-response.dto';
import { DidixOperationsLuTransactionRequestDto } from '@rest/didix-operations/lu-transaction-request.dto';
import { DidixOperationsLuTransactionResponseDto } from '@rest/didix-operations/lu-transaction-response.dto';
import { DidixOperationsCreateManualTxnRequestDto } from '@rest/didix-operations/create-manual-txn-orchestration-request.dto';

import { DidixOperationsBaseComponent } from './../shared/base.component';
import { ModalsService } from './modals/modals.service';
import { ParamsService } from './shared/params.service';
import { BaseParamsModel } from './shared/params-base.model';

@Component({
	selector: 'create-manual-txn-orchestration',
	templateUrl: './create-manual-txn-orchestration.html',
	providers: [
		ModalsService,
		ParamsService,
		PaginationService,
		DidixOperationsService
	]
})
export class DidixOperationsCreateManualTxnOrchestrationComponent extends DidixOperationsBaseComponent<ModalsService> implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('articlesList', { static: true }) articlesList: DropdownItemPickerComponent;
	private sub = new Subscription();

	articlesSubj = new Subject<DropdownItemPickerModel[]>();
	creditorsSubj = new Subject<DropdownItemPickerModel[]>();
	productsSubj = new Subject<DropdownItemPickerModel[]>();

	form: FormGroup;
	httpStatuses = HttpStatuses;
	timezone = Timezone;
	params = new BaseParamsModel();

	transactions: DidixOperationsLuTransactionResponseDto[] = [];

	loading = false;
	loadingArticles = false;
	loadingCreditors = false;
	loadingProducts = false;
	loadingTransactions = false;
	submitted = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private location: Location,
		private userService: UserService,
		private formBuilder: FormBuilder,
		private paramsService: ParamsService,
		private pager: PagerV2Service,
		public modalsService: ModalsService,
		public pagination: PaginatorV2Service,
		public service: DidixOperationsService
	) {
		super(modalsService, pagination, service);
		this.jobAliasName = 'generate-config-manual-txn-orchestration';
		this.createForm();
	}

	ngOnInit() {
		let configUrlSub = null;
		const sub = this.paramsService
			.getParamsSubj()
			.subscribe((params: BaseParamsModel) => {
				this.params = params;
				this.form.patchValue(params);
				configUrlSub = this.configUrlSubj().subscribe(() => this.initTransactions());
			});

		this.sub.add(configUrlSub);
		this.sub.add(sub);
	}

	ngAfterViewInit() {
		this.initProducts();
		this.initCreditors();
		this.initHistory();
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	pageTransactionsChanged() {
		this.params.page = this.pager.get().page;
		this.params.itemsPerPage = this.pager.get().itemsPerPage;
		this.paramsService.setParamsSubj(this.params);
	}

	changedArticle(value: string) {
		this.params.article = value;
	}

	changedProduct(value: number) {
		this.params.productId = value;
		if(!value) {
			this.articlesList.reset();
			this.params.article = null;
		}
		this.initArticles(value);
	}

	changedCreditor(value: number) {
		this.params.creditor = value;
	}

	changeRedeemDate(date: Date) {
		this.params.redeemDate = date;
	}

	applyFilters() {
		this.paramsService.setParamsSubj(Object.assign(this.params, {redeemAmt: this.form.get('redeemAmt').value}));
	}

	goToBack() {
		this.router.navigate(['/portal/tools/didix-operations']);
	}

	openCreteModal() {
		this.applyFilters();
		const data = new DidixOperationsLuTransactionResponseDto({
			article: this.params.article,
			articleDesc: undefined,
			productId: this.params.productId,
			productDesc: undefined,
			creditor: this.params.creditor,
			creditorDesc: undefined,
			redeemAmt: this.params.redeemAmt,
			redeemDate: this.params.redeemDate,
			code: undefined
		});

		this.modalsService.openCreateModal(data)
			.subscribe(dto => {
				if (dto) {
					this.submit(dto);
				}
			});
	}

	openDeleteModal(index: number, item: DidixOperationsLuTransactionResponseDto) {
		this.modalsService.openDeleteModal(item)
			.subscribe(dto => {
				if (dto) {
					this.submit(dto);
				}
			});
	}

	submit(dto: DidixOperationsCreateManualTxnRequestDto) {
		this.submitted = true;

		const sub = this.userService.getUserInfoSubj()
			.subscribe((userInfo) => {
				const queries = new DidixOperationsCreateManualTxnRequestDto({
					userId: userInfo.sub,
					userEmail: userInfo.email,
					userName: userInfo.name,
					operation: dto.operation,
					article: dto.article,
					redeemAmt: dto.redeemAmt,
					productId: dto.productId,
					redeemDate: dto.redeemDate,
					creditor: dto.creditor,
					code: dto.code
				});

				this.service
					.post<DidixOperationsCreateManualTxnRequestDto>(this.jobAliasName, queries)
					.subscribe(
						(r: BaseResponseDto) => {
							alertsService.success(r.message);

							this.submitted = false;
							this.modalsService.closeModal();
							this.initHistory();
						},
						(err)=> {
							this.submitted = false;
							alertsService.error(err.message);
						}
					);
			});

		this.sub.add(sub);
	}

	private initTransactions() {
		this.loadingTransactions = true;

		const params = new DidixOperationsLuTransactionRequestDto({
			article: this.params.article,
			productId: this.params.productId,
			redeemAmt: this.params.redeemAmt,
			redeemDate: this.params.redeemDate ? moment(this.params.redeemDate).format('YYYY/MM/DD') : undefined,
			creditor: this.params.creditor,
			page: this.params.page,
			itemsPerPage: this.params.itemsPerPage
		});

		this.service
			.getLuTransactions(params)
			.subscribe(
				resp => {
					this.loadingTransactions = false;
					this.transactions = resp.content;
					this.pager.setSubj({
						page: resp.pagination.page,
						itemsPerPage: resp.pagination.itemsPerPage,
						previous: resp.pagination.previous,
						next: resp.pagination.next,
						totalItems: resp.pagination.totalItems,
						totalPages:resp.pagination.totalPages
					});

				},
				() => this.loadingTransactions = false
			);
	}

	private initArticles(productId: number) {
		this.loadingArticles = true;

		if(!productId) {
			this.loadingArticles = false;
			return;
		}

		const requestDto = new DidixOperationsArticleRequestDto({productId: productId});
		const sub = this.service
			.getArticles(requestDto)
			.subscribe(
				resp => {
					this.loadingArticles = false;
					const list = this.composeArticlesDropdownList(resp);
					this.articlesSubj.next(list);
				},
				() => this.loadingArticles = false
			);

		this.sub.add(sub);
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

	private initCreditors() {
		this.loadingCreditors = true;

		this.service
			.getCreditor()
			.subscribe(
				resp => {
					this.loadingCreditors = false;
					const list = this.composeCreditorDropdownList(resp);

					this.creditorsSubj.next(list);
					this.creditorsSubj.complete();
				},
				() => this.loadingCreditors = false
			);
	}

	private composeArticlesDropdownList(items: DidixOperationsArticleResponseDto[]): DropdownItemPickerModel[] {
		return items.map((item) => {
			return new DropdownItemPickerModel({
				name: item.articleDesc,
				value: item.article,
				checked: item.article === this.params.article
			});
		});
	}

	private composeCreditorDropdownList(items: DidixOperationsCreditorResponseDto[]): DropdownItemPickerModel[] {
		return items.map((item) => {
			return new DropdownItemPickerModel({
				name: item.creditorDesc,
				value: item.creditorId,
				checked: item.creditorId === this.params.creditor
			});
		});
	}

	private composeProductsDropdownList(items: DidixOperationsProductResponseDto[]): DropdownItemPickerModel[] {
		return items.map((item) => {
			return new DropdownItemPickerModel({
				name: item.productDesc,
				value: item.productId,
				checked: this.params.productId === item.productId
			});
		});
	}

	private configUrlSubj() {
		const subj = new Subject<never>();

		const queryParams: NavigationExtras = {
			queryParams: {
				'article': this.params.article,
				'redeemAmt': this.params.redeemAmt,
				'redeemDate': this.params.redeemDate,
				'productId': this.params.productId,
				'creditor': this.params.creditor,
				'page': this.params.page,
				'itemsPerPage': this.params.itemsPerPage
			},
			queryParamsHandling: 'merge',
			relativeTo: this.route,
			replaceUrl: true
		};

		this.router.navigate(['.'], queryParams)
			.then(() => {
				subj.next();
				subj.complete();
			});

		return subj;
	}

	private createForm() {
		this.form = this.formBuilder.group({
			article: [null],
			productId: [null],
			redeemAmt: [null],
			redeemDate: [null, [FormValidationService.getDateValidator('YYYY/MM/DD')]],
			creditor: [null]
		});
	}
}
