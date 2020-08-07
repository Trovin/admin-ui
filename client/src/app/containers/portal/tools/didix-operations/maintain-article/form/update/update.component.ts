import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import * as moment from 'moment';

import { UserService } from '@core/user/user.service';

import { Timezone } from '@enums/timezone.enum';

import { alertsService } from '@components/ui/alerts/alerts.service';
import { PaginationService } from '@containers/shared/pagination.service';
import { PaginatorV2Service } from '@components/ui/paginator-v2/paginator.service';

import { BaseResponseDto } from '@rest/shared/base-response.dto';
import { DidixOperationsService } from '@rest/didix-operations/didix-operations.service';
import { DidixOperationsLuArticleResponseDto } from '@rest/didix-operations/lu-article-response.dto';
import { DidixOperationsLuArticlesRequestDto } from '@rest/didix-operations/lu-articles-request.dto';
import { DidixOperationsLuArticleUpdateRequestDto } from '@rest/didix-operations/lu-article-update-request.dto';

import { ModalsService } from './modals/modals.service';

import { DidixOperationsBaseComponent } from './../../../shared/base.component';

@Component({
	selector: 'maintain-articles-form-update',
	templateUrl: './update.html',
	providers: [
		ModalsService,
		PaginationService,
		DidixOperationsService
	]
})
export class DidixOperationsMaintainArticlesFormUpdateComponent extends DidixOperationsBaseComponent<ModalsService> implements OnInit {
	private sub = new Subscription();

	jobAliasName = 'update-lu-article';
	params: DidixOperationsLuArticlesRequestDto;
	items: DidixOperationsLuArticleResponseDto[] = [];
	productDesc = '';
	productId = '';
	timezone = Timezone;
	loading = false;
	submitted = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private userService: UserService,
		public modalsService: ModalsService,
		public pagination: PaginatorV2Service,
		public service: DidixOperationsService
	) {
		super(modalsService, pagination, service);
		this.jobAliasName = 'update-lu-article';
	}

	ngOnInit() {
		this.params = new DidixOperationsLuArticlesRequestDto({
			productId: Number(this.route.snapshot.queryParamMap.get('productId'))
		});

		this.productDesc = this.route.snapshot.queryParamMap.get('productDesc');
		this.productId = this.route.snapshot.queryParamMap.get('productId');

		this.init();
		this.initHistory();
	}

	goToBack() {
		this.router.navigate(['/portal/tools/didix-operations/maintain-articles']);
	}

	openUpdateModal(index: number, item: DidixOperationsLuArticleResponseDto) {
		this.modalsService.openUpdateModal(item)
			.subscribe((dto: DidixOperationsLuArticleUpdateRequestDto) => {
				if(dto) {
					this.submit(dto);
				}
			});
	}

	openCreteModal() {
		const data = new DidixOperationsLuArticleResponseDto({
			article: '',
			articleDesc: '',
			productId: Number(this.productId),
			productDesc: undefined,
			discontinued: null,
			startDate: null
		});
		this.modalsService.openCreateModal(data)
			.subscribe((dto: DidixOperationsLuArticleUpdateRequestDto) => {
				if (dto) {
					this.submit(dto);
				}
			});
	}

	openDeleteModal(index: number, item: DidixOperationsLuArticleResponseDto) {
		this.modalsService.openDeleteModal(item)
			.subscribe((dto: DidixOperationsLuArticleUpdateRequestDto) => {
				if (dto) {
					this.submit(dto);
				}
			});
	}

	submit(dto: DidixOperationsLuArticleUpdateRequestDto) {
		this.submitted = true;

		this.modalsService.toggleSubmit(true);

		const sub = this.userService.getUserInfoSubj()
		.subscribe((userInfo) => {
			const queries = new DidixOperationsLuArticleUpdateRequestDto({
				userId: userInfo.sub,
				userEmail: userInfo.email,
				userName: userInfo.name,
				...dto
			});

			this.service
				.post<DidixOperationsLuArticleUpdateRequestDto>(this.jobAliasName, queries)
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

	init() {
		this.loading = true;
		this.service
			.getLuArticles(this.params)
			.subscribe(
				(resp) => {
					this.loading = false;
					this.items = resp;
				},
				() => this.loading = false
			);
	}
}
