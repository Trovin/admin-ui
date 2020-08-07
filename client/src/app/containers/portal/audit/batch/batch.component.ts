import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';

import { AuditBatchService } from '@rest/audit/batch/batch.service';
import { AuditReplayService } from '@rest/audit-replay';
import { AuditHideService } from '@rest/audit-hide';

import { PipelineType } from '@enums/pipeline-type.enum';
import { PipelineProcessType } from '@enums/pipeline-process-type.enum';

import { DateTimeFormatPipe } from '@components/ui/pipes/date-time-format.pipe';
import { PaginatorV2Service } from '@components/ui/paginator-v2/paginator.service';

import { ReplayConstants } from './../shared/replay.constant';
import { BaseStatsComponent } from './../shared/base-stats.component';
import { AuditHeaderNavigationModel } from './../shared/header/header-navigation.model';

import { AuditBatchModel } from './batch.model';
import { AuditStatsBaseDto } from '@rest/audit/shared/stats-base';

@Component({
	selector: 'batch',
	templateUrl: './batch.html',
	providers: [
		AuditBatchService,
		AuditReplayService,
		AuditHideService,
		DateTimeFormatPipe
	]
})

export class AuditBatchComponent extends BaseStatsComponent {
	items: AuditBatchModel[] = [];

	process = PipelineProcessType.getAlias(PipelineProcessType.BATCH);

	navigation: AuditHeaderNavigationModel[] = [
		{
			title: 'Next step (Data Transfer)',
			href: ['/portal', 'audit', 'data-transfer'],
			e2e: 'next-step',
			isVisible: false,
			permissions: [
				PipelineType.BATCH,
				PipelineType.HISTORICAL_BATCH,
				PipelineType.REAL_TIME
			]
		}
	];

	constructor(
		router: Router,
		route: ActivatedRoute,
		service: AuditBatchService,
		replayService: AuditReplayService,
		hideService: AuditHideService,
		paginatorService: PaginatorV2Service,
		modalService: BsModalService
	) {
		super(router, route, paginatorService);
		super.setModalService(modalService);
		super.setReplayService(replayService);
		super.setHideService(hideService);
		super.setResolveService<AuditBatchService>(service);
	}

	replay(item: AuditBatchModel) {
		super.replay<AuditBatchModel>(item, this.process);

		this.items
			.filter(value => value.runId === item.runId)
			.map(value => value.replayStatus = ReplayConstants.REPLAY_TRIGGERED_MESSAGE);
	}

	openConfirmHideItem(item: AuditBatchModel) {
		super.openConfirmHideItem<AuditBatchModel>(item, this.process);
	}

	protected composeBatchS3Url(item: AuditStatsBaseDto) {
		if(item.processedObjectKey) {
			return super.composeS3Url(item.bucketName, item.processedObjectKey);
		}

		return super.composeS3Url(item.bucketName, item.objectKey);
	}

	protected onFetch(items: AuditBatchModel[]) {
		this.items = items.map(i => new AuditBatchModel({
			...i,
			...this.composeErrorsDetailsPageParams(i, PipelineProcessType.getAlias(PipelineProcessType.BATCH))
		}));
	}
}
