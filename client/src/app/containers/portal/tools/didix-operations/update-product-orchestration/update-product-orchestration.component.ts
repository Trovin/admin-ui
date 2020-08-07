import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { UserService } from '@core/user/user.service';

import { PaginationService } from '@containers/shared/pagination.service';

import { alertsService } from '@components/ui/alerts/alerts.service';

import { BaseResponseDto } from '@rest/shared/base-response.dto';
import { DidixOperationsService } from '@rest/didix-operations/didix-operations.service';
import { DidixOperationsLuProductResponseDto } from '@rest/didix-operations/lu-product-response.dto';
import { DidixOperationsUpdateProductRequestDto } from '@rest/didix-operations/update-product-orchestration-request.dto';

import { ModalsService } from './modals/modals.service';
import { DidixOperationsBaseComponent } from '@containers/portal/tools/didix-operations/shared/base.component';
import { PaginatorV2Service } from '@components/ui/paginator-v2/paginator.service';

@Component({
	selector: 'update-product-orchestration',
	templateUrl: './update-product-orchestration.html',
	providers: [
		ModalsService,
		PaginationService,
		DidixOperationsService
	]
})

export class DidixOperationsUpdateProductOrchestrationComponent extends DidixOperationsBaseComponent<ModalsService> implements OnInit {
	private isRouterNavigated = false;
	private sub = new Subscription();

	items: DidixOperationsLuProductResponseDto[] = [];
	loadingLuProducts = false;
	submitted = false;

	constructor(
		private router: Router,
		private userService: UserService,
		public modalsService: ModalsService,
		public pagination: PaginatorV2Service,
		public service: DidixOperationsService
	) {
		super(modalsService, pagination, service);
		this.jobAliasName = 'update-product-orchestration';
	}

	ngOnInit() {
		this.isRouterNavigated = this.router.navigated;
		this.initLuProducts();
		this.initHistory();
	}

	goToBack() {
		this.router.navigate(['/portal/tools/didix-operations']);
	}

	openUpdateModal(index: number, item: DidixOperationsLuProductResponseDto) {
		this.modalsService.openUpdateModal(item)
			.subscribe((dto: DidixOperationsUpdateProductRequestDto) => {
				if (dto) {
					this.submit(dto);
				}
			});
	}

	openCreteProductModal() {
		const data = new DidixOperationsLuProductResponseDto({
			productId: null,
			productDesc: '',
			contentTypeId: null,
			boxsetyn: 0,
			discontinuedyn: 0,
			prepaidyn: 0,
			image: '',
			sortId: null,
			currencyId: '',
			countryId: '',
			contentTypeDesc: ''
		});
		this.modalsService.openCreateModal(data)
			.subscribe((dto: DidixOperationsUpdateProductRequestDto) => {
				if (dto) {
					this.submit(dto);
				}
			});
	}

	submit(dto: DidixOperationsUpdateProductRequestDto) {
		this.submitted = true;

		this.modalsService.toggleSubmit(true);

		const sub = this.userService.getUserInfoSubj()
			.subscribe((userInfo) => {
				const queries = new DidixOperationsUpdateProductRequestDto({
					userId: userInfo.sub,
					userEmail: userInfo.email,
					userName: userInfo.name,
					...dto
				});

				this.service
					.post<DidixOperationsUpdateProductRequestDto>(this.jobAliasName, queries)
					.subscribe(
						(r: BaseResponseDto) => {
							alertsService.success(r.message);
							this.modalsService.toggleSubmit(false);
							this.modalsService.closeModal();
							this.initHistory();
						},
						(err) => {
							this.modalsService.toggleSubmit(false);
							alertsService.error(err.message);
						}
					);
			});

		this.sub.add(sub);
	}

	initLuProducts() {
		this.loadingLuProducts = true;
		this.service
			.getLuProducts()
			.subscribe(
				(resp) => {
					this.loadingLuProducts = false;
					this.items = resp;
				},
				() => this.loadingLuProducts = false
			);
	}
}
