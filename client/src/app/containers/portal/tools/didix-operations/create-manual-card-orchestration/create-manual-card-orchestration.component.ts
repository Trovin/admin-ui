import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';

import { Subscription, Subject } from 'rxjs';

import * as moment from 'moment';

import { UserService } from '@core/user/user.service';

import { HttpStatuses } from '@enums/http-statuses.enum';

import { alertsService } from '@components/ui/alerts/alerts.service';
import { PagerV2Service } from '@components/ui/paginator-v2/pager/pager.service';
import { PaginatorV2Service } from '@components/ui/paginator-v2/paginator.service';
import { FormValidationService } from '@components/ui/form-message/form-validation.service';
import { DropdownItemPickerModel } from '@components/ui/dropdown-item-picker/dropdown-item-picker.model';
import { DropdownItemPickerComponent } from '@components/ui/dropdown-item-picker/dropdown-item-picker.component';

import { BaseResponseDto } from '@rest/shared/base-response.dto';
import { DidixOperationsService } from '@rest/didix-operations/didix-operations.service';
import { DidixOperationsLuCardRequestDto } from '@rest/didix-operations/lu-card-request.dto';
import { DidixOperationsDebtorResponseDto } from '@rest/didix-operations/debtor-response.dto';
import { DidixOperationsArticleRequestDto } from '@rest/didix-operations/articles-request.dto';
import { DidixOperationsLuCardResponseDto } from '@rest/didix-operations/lu-card-response.dto';
import { DidixOperationsArticleResponseDto } from '@rest/didix-operations/article-response.dto';
import { DidixOperationsProductResponseDto } from '@rest/didix-operations/product-response.dto';

import { DidixOperationsCreateManualCardRequestDto } from '@rest/didix-operations/create-manual-card-orchestration-request.dto';

import { DidixOperationsBaseComponent } from './../shared/base.component';
import { ModalsService } from './modals/modals.service';
import { BaseParamsModel } from './shared/params-base.model';
import { ParamsService } from './shared/params.service';
import { Timezone } from '@enums/timezone.enum';

@Component({
	selector: 'create-manual-card-orchestration',
	templateUrl: './create-manual-card-orchestration.html',
	providers: [
		ModalsService,
		ParamsService,
		PaginatorV2Service,
		DidixOperationsService
	]
})

export class DidixOperationsCreateManualCardOrchestrationComponent extends DidixOperationsBaseComponent<ModalsService> implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('articlesList', { static: true }) articlesList: DropdownItemPickerComponent;

	private sub = new Subscription();

	articlesSubj = new Subject<DropdownItemPickerModel[]>();
	debtorsSubj = new Subject<DropdownItemPickerModel[]>();
	productsSubj = new Subject<DropdownItemPickerModel[]>();

	form: FormGroup;
	timezone = Timezone;
	httpStatuses = HttpStatuses;
	params = new BaseParamsModel();

	cards: DidixOperationsLuCardResponseDto[] = [];

	loading = false;
	submitted = false;
	loadingDebtors: boolean;
	loadingProducts = false;
	loadingArticles = false;
	loadingLuCards = false;

	constructor(
		private router: Router,
		private location: Location,
		private formBuilder: FormBuilder,
		private userService: UserService,
		private route: ActivatedRoute,
		private paramsService: ParamsService,
		private pager: PagerV2Service,
		public modalsService: ModalsService,
		public pagination: PaginatorV2Service,
		public service: DidixOperationsService
	) {
		super(modalsService, pagination, service);
		this.jobAliasName = 'generate-config-manual-card-orchestration';
		this.createForm();
	}

	ngOnInit() {
		let configUrlSub = null;
		const sub = this.paramsService
			.getParamsSubj()
			.subscribe((params: BaseParamsModel) => {
				this.params = params;
				this.form.patchValue(params);
				configUrlSub = this.configUrlSubj().subscribe(() => this.initLuCards());
			});

		this.sub.add(configUrlSub);
		this.sub.add(sub);
	}

	ngAfterViewInit() {
		this.initProducts();
		this.initDebtors();
		this.initHistory();
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	pageLuCardChanged() {
		this.params.page = this.pager.get().page;
		this.params.itemsPerPage = this.pager.get().itemsPerPage;
		this.paramsService.setParamsSubj(this.params);
	}

	goToBack() {
		this.router.navigate(['/portal/tools/didix-operations']);
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

	changedDebtor(value: string) {
		this.params.debtor = value;
	}

	changeSalesDate(date: Date) {
		this.params.salesDate = date;
	}

	submit(item: DidixOperationsCreateManualCardRequestDto) {
		this.submitted = true;

		const sub = this.userService.getUserInfoSubj()
			.subscribe((userInfo) => {
				const queries = new DidixOperationsCreateManualCardRequestDto({
					userId: userInfo.sub,
					userEmail: userInfo.email,
					userName: userInfo.name,
					operation: item.operation,
					article: item.article,
					productId: item.productId,
					debtor: item.debtor,
					salesPrice: item.salesPrice,
					salesDate: item.salesDate,
					salesTime: item.salesTime,
					code: item.code
				});

				this.service
					.post<DidixOperationsCreateManualCardRequestDto>(this.jobAliasName, queries)
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

	openCreteModal() {
		this.applyFilters();
		const data = new DidixOperationsLuCardResponseDto({
			article: this.params.article,
			articleDesc: undefined,
			productId: this.params.productId,
			productDesc: undefined,
			debtor: this.params.debtor,
			debtorDesc: undefined,
			salesDateId: this.params.salesDate,
			salesPrice: this.params.salesPrice,
			code: undefined
		});

		this.modalsService.openCreateModal(data)
			.subscribe((dto: DidixOperationsCreateManualCardRequestDto) => {
				if (dto) {
					this.submit(dto);
				}
			});
	}

	openDeleteModal(index: number, item: DidixOperationsLuCardResponseDto) {
		this.modalsService.openDeleteModal(item)
			.subscribe((dto: DidixOperationsCreateManualCardRequestDto) => {
				if (dto) {
					this.submit(dto);
				}
			});
	}

	applyFilters() {
		this.paramsService.setParamsSubj(Object.assign(this.params, {salesPrice: this.form.get('salesPrice').value}));
	}

	private initLuCards() {
		this.loadingLuCards = true;

		const params = new DidixOperationsLuCardRequestDto({
			article: this.params.article,
			productId: this.params.productId,
			productDesc: this.params.productDesc,
			debtor: this.params.debtor,
			salesDate: this.params.salesDate ? moment(this.params.salesDate).format('YYYY/MM/DD') : undefined,
			salesPrice: this.params.salesPrice,
			salesAmountEuro: this.params.salesAmountEuro,
			code: this.params.code,
			page: this.params.page,
			itemsPerPage: this.params.itemsPerPage
		});

		this.service
			.getLuCards(params)
			.subscribe(
				resp => {
					this.loadingLuCards = false;
					this.cards = resp.content;
					this.pager.setSubj({
						page: resp.pagination.page,
						itemsPerPage: resp.pagination.itemsPerPage,
						previous: resp.pagination.previous,
						next: resp.pagination.next,
						totalItems: resp.pagination.totalItems,
						totalPages:resp.pagination.totalPages
					});

				},
				() => this.loadingLuCards = false
			);
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

	private composeArticlesDropdownList(items: DidixOperationsArticleResponseDto[]): DropdownItemPickerModel[] {
		return items.map((item) => {
			return new DropdownItemPickerModel({
				name: item.articleDesc,
				value: item.article,
				checked: item.article === this.params.article
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

					this.debtorsSubj.next(list);
					this.debtorsSubj.complete();
				},
				() => this.loadingDebtors = false
			);
	}

	private composeDebtorDropdownList(items: DidixOperationsDebtorResponseDto[]): DropdownItemPickerModel[] {
		return items.map((item) => {
			return new DropdownItemPickerModel({
				name: item.debtorDesc,
				value: item.debtorId,
				checked: item.debtorId === this.params.debtor
			});
		});
	}

	private composeProductsDropdownList(items: DidixOperationsProductResponseDto[]): DropdownItemPickerModel[] {
		return items.map((item) => {
			return new DropdownItemPickerModel({
				name: `${item.productDesc}`,
				value: item.productId,
				checked: item.productId === this.params.productId
			});
		});
	}

	private configUrlSubj() {
		const subj = new Subject<never>();

		const queryParams: NavigationExtras = {
			queryParams: {
				'article': this.params.article,
				'productId': this.params.productId,
				'salesPrice': this.params.salesPrice,
				'salesDate': this.params.salesDate,
				'debtor': this.params.debtor,
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
			salesPrice: [null],
			salesDate: [null, [FormValidationService.getDateValidator('MM/DD/YYYY')]],
			salesTime: ['00:00:00'],
			debtor: [null],
			code: [null]
		});
	}
}
