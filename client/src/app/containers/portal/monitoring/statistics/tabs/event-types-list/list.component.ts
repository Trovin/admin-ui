import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { PaginationService } from './../shared/pagination.service';

import { MonitoringEventTypesService, MonitoringEventTypeDto, MonitoringEventTypesQueriesDto } from '@rest/monitoring-sources/event-types';
import { PipelineType } from '@enums/pipeline-type.enum';

@Component({
	selector: 'monitoring-event-types',
	templateUrl: './list.html',
	providers: [
		MonitoringEventTypesService,
		PaginationService
	]
})

export class MonitoringStatsEventTypesListComponent implements OnInit {
	@Input() queries: MonitoringEventTypesQueriesDto;
	@Input() sourceApplication: string;

	private opened: MonitoringEventTypeDto[] = [];

	items: MonitoringEventTypeDto[] = [];

	pipeline: PipelineType;
	pipelineType = PipelineType;

	// isBatchPipeline = false; // @TODO: Hold on. do not have clear vision
	loading = false;

	constructor(
		private router: Router,
		private service: MonitoringEventTypesService
	) {}

	ngOnInit() {
		this.pipeline = this.getPipeline();
		// this.isBatchPipeline = !!~[PipelineType.BATCH, PipelineType.HISTORICAL_BATCH].indexOf(this.pipeline); // @TODO: Hold on. do not have clear vision
		this.fetch();
	}

	openedRow(item: any): boolean {
		return !!~this.opened.indexOf(item);
	}

	private fetch() {
		const params = this.getParams();
		const sourceApplication = this.sourceApplication;

		this.loading = true;
		this.service
			.getList(params, this.pipeline, sourceApplication)
			.subscribe(
				data => {
					this.loading = false;
					this.items = data;
				},
				() => {
					this.items = [];
					this.loading = false;
				}
			);
	}

	private getPipeline() {
		const urlTree = this.router.parseUrl(this.router.url);
		const segments = urlTree.root.children['primary'].segments;
		const pipeline = PipelineType.getByAlias(segments[segments.length - 1].path);

		return pipeline;
	}

	private getParams() {
		return new MonitoringEventTypesQueriesDto({
			dateFrom: this.queries.dateFrom,
			dateTo: this.queries.dateTo,
			dateRangeColumnType: this.queries.dateRangeColumnType
		});
	}
}
