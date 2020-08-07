import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';

import { UserService } from '@core/user/user.service';

import { PaginationService } from '@containers/shared/pagination.service';

import { HttpStatuses } from '@enums/http-statuses.enum';
import { alertsService } from '@components/ui/alerts/alerts.service';

import { PaginatorV2Service } from '@components/ui/paginator-v2/paginator.service';

import { ModalsService } from './modals/modals.service';
import { BaseResponseDto } from '@rest/shared/base-response.dto';
import { DidixOperationsService } from '@rest/didix-operations/didix-operations.service';
import { DidixOperationsFctProductPlanRequestDto } from '@rest/didix-operations/fct-product-plan-request.dto';
import { DidixOperationsFctProductPlanUpdateRequestDto } from '@rest/didix-operations/fct-product-plan-update-request.dto';

import { DidixOperationsFctProductPlanResponseDto, IDidixOperationsFctProductPlanColumnResponseDto } from '@rest/didix-operations/fct-product-plan-response.dto';
import { DidixOperationsBaseComponent } from './../../../shared/base.component';

@Component({
	selector: 'fct-product-plan-wk-orchestration-form-update',
	templateUrl: './update.html',
	providers: [
		ModalsService,
		PaginationService,
		DidixOperationsService
	]
})
export class DidixOperationsFctProductPlanWkOrchestrationFormUpdateComponent extends DidixOperationsBaseComponent<ModalsService> implements OnInit, OnDestroy {
	@ViewChild('bsDp', { static: true }) bsDp: BsDatepickerDirective;

	private sub = new Subscription();

	httpStatuses = HttpStatuses;
	items: DidixOperationsFctProductPlanResponseDto[] = [];
	actualSales: any[] = [];
	actualSalesTotalCount = null;
	productsPlansPlanAmountTotalCount = 0;
	productsPlansTargetAmountTotalCount = 0;
	params = new DidixOperationsFctProductPlanRequestDto;

	currency = '';
	productName = '';
	fiscalYearId = null;
	currentYear = new Date().getFullYear();

	loading = false;
	submitted = false;
	loadingActualSales = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private userService: UserService,
		public modalsService: ModalsService,
		public pagination: PaginatorV2Service,
		public service: DidixOperationsService
	) {
		super(modalsService, pagination, service);
		this.jobAliasName = 'fct_product_plan_wk_orchestration';
	}

	ngOnInit() {
		this.params = new DidixOperationsFctProductPlanRequestDto({
			productId: Number(this.route.snapshot.queryParamMap.get('productId')),
			fiscalYearId: Number(this.route.snapshot.queryParamMap.get('fiscalYearId'))
		});
		this.currency = this.route.snapshot.queryParamMap.get('currencyId');
		this.fiscalYearId = Number(this.route.snapshot.queryParamMap.get('fiscalYearId'));
		this.productName = this.route.snapshot.queryParamMap.get('productName');

		this.initProductsPlans();
		this.initActualSales();
		this.initHistory();
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	openUpdateModal(index: number, subIndex:number, item: IDidixOperationsFctProductPlanColumnResponseDto) {
		this.modalsService.openUpdateModal(item, item.fiscalYearId)
			.subscribe(dto => {
				if (dto) {
					this.submit(dto);
				}
			});
	}

	goToBack() {
		this.router.navigate(['/portal/tools/didix-operations/maintain-planning']);
	}

	initProductsPlans() {
		this.loading = true;
		this.service
			.getFctProductsPlans(this.params)
				.subscribe(
					resp => {
						this.items = resp;
						this.productsPlansPlanAmountTotalCount = this.countSum(resp, 'planAmount');
						this.productsPlansTargetAmountTotalCount = this.countSum(resp, 'targetAmount');
						this.loading = false;
					},
					() => this.loading = false
				);
	}

	initActualSales() {
		this.loadingActualSales = true;
		this.service
			.getFctActualSales(this.params)
			.subscribe(
				resp => {
					this.actualSales = resp;
					this.actualSalesTotalCount = this.countSum(resp, 'salesAmount');
					this.loadingActualSales = false;
				},
				() => this.loadingActualSales = false
			);
	}

	submit(dto: DidixOperationsFctProductPlanUpdateRequestDto) {
		this.submitted = true;

		this.modalsService.toggleSubmit(true);

		const sub = this.userService.getUserInfoSubj()
			.subscribe((userInfo) => {
				const queries = new DidixOperationsFctProductPlanUpdateRequestDto({
					userId: userInfo.sub,
					userEmail: userInfo.email,
					userName: userInfo.name,
					...dto
				});

				this.service
					.post<DidixOperationsFctProductPlanUpdateRequestDto>(this.jobAliasName, queries)
					.subscribe(
						(r: BaseResponseDto) => {
							alertsService.success(r.message);
							this.modalsService.closeModal();
							this.modalsService.toggleSubmit(false);
							this.initHistory();
						},
						() => this.modalsService.toggleSubmit(false)
					);
			});

		this.sub.add(sub);
	}

	private countSum<T>(items: T[], field: string) {
		return items.map(e => {
			return e['columns'].reduce((previousValue, currentValue) => previousValue += Number(currentValue[field]), 0);
		}).reduce((a, b) => a + b, 0);
	}
}
