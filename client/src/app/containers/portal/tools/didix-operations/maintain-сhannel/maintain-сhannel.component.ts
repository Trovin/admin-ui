import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { UserService } from '@core/user/user.service';

import { PaginationService } from '@containers/shared/pagination.service';

import { alertsService } from '@components/ui/alerts/alerts.service';

import { BaseResponseDto } from '@rest/shared/base-response.dto';
import { DidixOperationsService } from '@rest/didix-operations/didix-operations.service';
import { DidixOperationsLuChannelResponseDto } from '@rest/didix-operations/lu-channel-response.dto';
import { DidixOperationsLuChannelUpdateRequestDto } from '@rest/didix-operations/lu-channel-update-request.dto';

import { ModalsService } from './modals/modals.service';
import { DidixOperationsBaseComponent } from '@containers/portal/tools/didix-operations/shared/base.component';
import { PaginatorV2Service } from '@components/ui/paginator-v2/paginator.service';

@Component({
	selector: 'maintain-сhannel',
	templateUrl: './maintain-сhannel.html',
	providers: [
		ModalsService,
		PaginationService,
		DidixOperationsService
	]
})

export class DidixOperationsMaintainChannelComponent extends DidixOperationsBaseComponent<ModalsService> implements OnInit {
	private sub = new Subscription();

	items: DidixOperationsLuChannelResponseDto[] = [];
	loading = false;
	submitted = false;

	constructor(
		private router: Router,
		private userService: UserService,
		public modalsService: ModalsService,
		public pagination: PaginatorV2Service,
		public service: DidixOperationsService
	) {
		super(modalsService, pagination, service);
		this.jobAliasName = 'update-lu-channel';
	}
	ngOnInit() {
		this.init();
		this.initHistory();
	}

	goToBack() {
		this.router.navigate(['/portal/tools/didix-operations']);
	}

	openUpdateModal(index: number, item: DidixOperationsLuChannelResponseDto) {
		this.modalsService.openUpdateModal(item)
			.subscribe((dto: DidixOperationsLuChannelUpdateRequestDto) => {
				if (dto) {
					this.submit(dto);
				}
			});
	}

	openCreteModal() {
		const data = new DidixOperationsLuChannelResponseDto({
			channel: '',
			channelLogo: '',
			code2: '',
			code3: ''
		});
		this.modalsService.openCreateModal(data)
			.subscribe((dto: DidixOperationsLuChannelUpdateRequestDto) => {
				if (dto) {
					this.submit(dto);
				}
			});
	}

	submit(dto: DidixOperationsLuChannelUpdateRequestDto) {
		this.submitted = true;

		this.modalsService.toggleSubmit(true);

		const sub = this.userService.getUserInfoSubj()
		.subscribe((userInfo) => {
			const queries = new DidixOperationsLuChannelUpdateRequestDto({
				userId: userInfo.sub,
				userEmail: userInfo.email,
				userName: userInfo.name,
				...dto
			});

			this.service
				.post<DidixOperationsLuChannelUpdateRequestDto>(this.jobAliasName, queries)
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
			.getMaintainChannels()
			.subscribe(
				(resp) => {
					this.loading = false;
					this.items = resp;
				},
				() => this.loading = false
			);
	}
}
