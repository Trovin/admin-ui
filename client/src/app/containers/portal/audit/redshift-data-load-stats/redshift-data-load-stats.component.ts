import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';

import { AuditRedhsiftDataLoadStatsService } from '@rest/audit/redshift-data-load-stats/redshift-data-load-stats.service';
import { AuditStatsBaseDto } from '@rest/audit/shared/stats-base';
import { AuditReplayService } from '@rest/audit-replay';
import { AuditHideService } from '@rest/audit-hide';

import { PipelineProcessType } from '@enums/pipeline-process-type.enum';
import { AuditSearchType } from '@enums/audit-search-type.enum';

import { DateTimeFormatPipe } from '@components/ui/pipes/date-time-format.pipe';
import { PaginatorV2Service } from '@components/ui/paginator-v2/paginator.service';

import { AuditHeaderNavigationModel } from './../shared/header/header-navigation.model';
import { BaseStatsComponent } from './../shared/base-stats.component';
import { ReplayConstants } from './../shared/replay.constant';

import { AuditRedshiftDataLoadStatsModel } from './redshift-data-load-stats.model';

@Component({
	selector: 'redshift-data-load',
	templateUrl: './redshift-data-load-stats.html',
	providers: [
		AuditRedhsiftDataLoadStatsService,
		AuditReplayService,
		AuditHideService,
		DateTimeFormatPipe
	]
})

export class AuditRedshiftDataLoadStatsComponent extends BaseStatsComponent {
	items: AuditRedshiftDataLoadStatsModel[] = [];

	excludeSearchOptions = [AuditSearchType.OUTPUT_OBJECT_KEY];
	process = PipelineProcessType.getAlias(PipelineProcessType.REDSHIFT_DATA_COPY);

	navigation: AuditHeaderNavigationModel[] = [
		{
			title: 'Previous step (Data Transfer)',
			href: ['/portal', 'audit', 'data-transfer'],
			e2e: 'previous-step-data-transfer',
			isVisible: false,
			permissions: []
		}
	];

	constructor(
		router: Router,
		route: ActivatedRoute,
		service: AuditRedhsiftDataLoadStatsService,
		replayService: AuditReplayService,
		hideService: AuditHideService,
		paginatorService: PaginatorV2Service,
		modalService: BsModalService
	) {
		super(router, route, paginatorService);
		super.setModalService(modalService);
		super.setReplayService(replayService);
		super.setHideService(hideService);
		super.setResolveService<AuditRedhsiftDataLoadStatsService>(service);
	}

	replay(item: AuditRedshiftDataLoadStatsModel) {
		super.replay<AuditRedshiftDataLoadStatsModel>(item, this.process);

		this.items
			.filter(value => value.runId === item.runId)
			.map(value => value.replayStatus = ReplayConstants.REPLAY_TRIGGERED_MESSAGE);
	}

	openConfirmHideItem(item: AuditRedshiftDataLoadStatsModel) {
		super.openConfirmHideItem<AuditRedshiftDataLoadStatsModel>(item, this.process);
	}

	protected onFetch(items: AuditStatsBaseDto[]) {
		this.items = items.map(i => new AuditRedshiftDataLoadStatsModel({
			...i,
			...this.composeErrorsDetailsPageParams(i, PipelineProcessType.getAlias(PipelineProcessType.REDSHIFT_DATA_COPY))
		}));
	}
}
