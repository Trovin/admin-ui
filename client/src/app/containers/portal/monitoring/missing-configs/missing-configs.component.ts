import { Component, OnInit } from '@angular/core';

import { S3UrIBuilderUtils } from '@utils/s3-url-builder.utils';

import { PipelineType } from '@enums/pipeline-type.enum';

import { alertsService } from '@components/ui/alerts/alerts.service';

import { MissingConfigsService, MissingConfigsDeleteQueriestDto } from '@rest/missing-configs';

import { ModalsService } from './modal/modals.service';
import { MissingConfigModel } from './missing-config.model';
import { filter } from 'rxjs/internal/operators/filter';

@Component({
	selector: 'missing-configs',
	templateUrl: './missing-configs.html',
	providers: [
		MissingConfigsService,
		ModalsService
	]
})

export class MonitoringMissingConfigsComponent implements OnInit {
	items: MissingConfigModel[] = [];
	timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	pipelineType = PipelineType;

	batchBucket = PipelineType.getAlias(PipelineType.BATCH);

	isBatchMissingConfigsExist = false;
	loading = false;

	constructor(
		private service: MissingConfigsService,
		private modalsService: ModalsService
	) {}

	ngOnInit() {
		this.fetch();
	}

	fetch() {
		this.loading = true;

		this.service
			.getList()
			.subscribe(
				resp => {
					this.loading = false;
					this.items = resp.map(e => new MissingConfigModel({
						...e,
						s3Url: S3UrIBuilderUtils.buildS3Url(e.bucketName, null),
						deleteInProcess: false
					}));
					this.isBatchMissingConfigsExist = this.items.some(item => this.pipelineType.BATCH === this.pipelineType.getByAlias(item.missingConfig));
				},
				() => {
					this.items = [];
					this.loading = false;
				}
			);
	}

	refresh() {
		this.fetch();
	}

	deleteDraftConfig(item: MissingConfigModel) {
		this.modalsService.openConfirmModal(item.missingConfig, item.sourceApplication, item.eventId)
			.pipe(
				filter(status => status)
			)
			.subscribe(status => this.onDelete(item));
	}

	private onDelete(item: MissingConfigModel) {
		item.deleteInProcess = true;

		const queries = new MissingConfigsDeleteQueriestDto({
			sourceApplication: item.sourceApplication,
			eventId: item.eventId
		});

		this.service
			.delete(item.missingConfig, queries)
			.subscribe(
				() => {
					alertsService.success('Successfully deleted');
					this.fetch();
				},
				() => item.deleteInProcess = false
			);
	}
}
