import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';

import { AuditStatsBaseDto } from '@rest/audit/shared/stats-base';
import { AuditDTLStatsService } from '@rest/audit/dtl-stats/dtl-stats.service';
import { AuditReplayService } from '@rest/audit-replay';
import { AuditHideService } from '@rest/audit-hide';

import { PipelineProcessType } from '@enums/pipeline-process-type.enum';
import { AuditSearchType } from '@enums/audit-search-type.enum';
import { PipelineType } from '@enums/pipeline-type.enum';

import { DateTimeFormatPipe } from '@components/ui/pipes/date-time-format.pipe';
import { PaginatorV2Service } from '@components/ui/paginator-v2/paginator.service';

import { ReplayConstants } from './../shared/replay.constant';
import { BaseStatsComponent } from './../shared/base-stats.component';
import { AuditHeaderNavigationModel } from './../shared/header/header-navigation.model';

import { AuditDTLModel } from './dtl-stats.model';

@Component({
	selector: 'data-transfer',
	templateUrl: './dtl-stats.html',
	providers: [
		AuditDTLStatsService,
		AuditReplayService,
		AuditHideService,
		DateTimeFormatPipe
	]
})

export class AuditDTLStatsComponent extends BaseStatsComponent {
	items: AuditDTLModel[] = [];

	process = PipelineProcessType.getAlias(PipelineProcessType.DATA_TRANSFER);

	excludeSearchOptions = [AuditSearchType.RAW_FILE_NAME];

	navigation: AuditHeaderNavigationModel[] = [
		{
			title: 'Previous step (Batch Data App)',
			href: ['/portal', 'audit', 'batch'],
			e2e: 'previous-step',
			isVisible: false,
			permissions: [PipelineType.BATCH]
		},
		{
			title: 'Next step (Redshift Data Load)',
			href: ['/portal', 'audit', 'redshift-data-copy'],
			e2e: 'next-step',
			isVisible: false,
			permissions: []
		}
	];

	constructor(
		router: Router,
		route: ActivatedRoute,
		service: AuditDTLStatsService,
		replayService: AuditReplayService,
		hideService: AuditHideService,
		paginatorService: PaginatorV2Service,
		modalService: BsModalService
	) {
		super(router, route, paginatorService);
		super.setModalService(modalService);
		super.setReplayService(replayService);
		super.setHideService(hideService);
		super.setResolveService<AuditDTLStatsService>(service);
		this.excludeSearchOptions = [AuditSearchType.RAW_FILE_NAME];
	}

	replay(item: AuditDTLModel) {
		super.replay<AuditDTLModel>(item, this.process);

		this.items
			.filter(value => value.runId === item.runId)
			.map(value => value.replayStatus = ReplayConstants.REPLAY_TRIGGERED_MESSAGE);
	}

	openConfirmHideItem(item: AuditDTLModel) {
		super.openConfirmHideItem<AuditDTLModel>(item, this.process);
	}

	protected onFetch(list: AuditStatsBaseDto[]) {
		this.items = list.map(i => new AuditDTLModel({
			...i,
			...this.composeErrorsDetailsPageParams(i, PipelineProcessType.getAlias(PipelineProcessType.DATA_TRANSFER))
		}));
	}
}
