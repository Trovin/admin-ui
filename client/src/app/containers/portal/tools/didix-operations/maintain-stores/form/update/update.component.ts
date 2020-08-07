import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { UserService } from '@core/user/user.service';

import { PaginationService } from '@containers/shared/pagination.service';

import { alertsService } from '@components/ui/alerts/alerts.service';
import { PaginatorV2Service } from '@components/ui/paginator-v2/paginator.service';

import { BaseResponseDto } from '@rest/shared/base-response.dto';
import { DidixOperationsService } from '@rest/didix-operations/didix-operations.service';
import { DidixOperationsLuStoreResponseDto } from '@rest/didix-operations/lu-store-response.dto';
import { DidixOperationsLuStoreUpdateRequestDto } from '@rest/didix-operations/lu-store-update-request.dto';


import { ModalsService } from './modals/modals.service';
import { DidixOperationsLuChannelRequestDto } from '@rest/didix-operations/lu-channel-request.dto';

import { DidixOperationsBaseComponent } from './../../../shared/base.component';

@Component({
	selector: 'maintain-stores-form-update',
	templateUrl: './update.html',
	providers: [
		ModalsService,
		PaginationService,
		DidixOperationsService
	]
})

export class DidixOperationsMaintainStoresFormUpdateComponent extends DidixOperationsBaseComponent<ModalsService> {
	private sub = new Subscription();

	params: DidixOperationsLuChannelRequestDto;
	items: DidixOperationsLuStoreResponseDto[] = [];
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
		this.jobAliasName = 'update-lu-store';
	}

	ngOnInit() {
		this.params = new DidixOperationsLuChannelRequestDto({
			channel: this.route.snapshot.queryParamMap.get('channel')
		});

		this.init();
		this.initHistory();
	}

	goToBack() {
		this.router.navigate(['/portal/tools/didix-operations/maintain-stores']);
	}

	openUpdateModal(index: number, item: DidixOperationsLuStoreResponseDto) {
		this.modalsService.openUpdateModal(item)
			.subscribe((dto: DidixOperationsLuStoreUpdateRequestDto) => {
				if (dto) {
					this.submit(dto);
				}
			});
	}

	openCreteModal() {
		const data = new DidixOperationsLuStoreResponseDto({
			channel: this.params.channel,
			storeId: '',
			storeDesc: '',
			city: '',
			postalCode: '',
			countryId: '',
			b2b: ''
		});

		this.modalsService.openCreateModal(data)
			.subscribe((dto: DidixOperationsLuStoreUpdateRequestDto) => {
				if (dto) {
					this.submit(dto);
				}
			});
	}

	submit(dto: DidixOperationsLuStoreUpdateRequestDto) {
		this.submitted = true;

		this.modalsService.toggleSubmit(true);

		const sub = this.userService.getUserInfoSubj()
			.subscribe((userInfo) => {
				const queries = new DidixOperationsLuStoreUpdateRequestDto({
					userId: userInfo.sub,
					userEmail: userInfo.email,
					userName: userInfo.name,
					...dto
				});

				this.service
					.post<DidixOperationsLuStoreUpdateRequestDto>(this.jobAliasName, queries)
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
			.getLuStores(this.params)
			.subscribe(
				(resp) => {
					this.loading = false;
					this.items = resp;
				},
				() => this.loading = false
			);
	}
}
