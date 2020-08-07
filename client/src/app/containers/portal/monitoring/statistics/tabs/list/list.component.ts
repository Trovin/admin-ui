import { Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

import { Subscription } from 'rxjs';

import {
	MonitoringSourcesQueriesDto,
	MonitoringSourcesModel,
	MonitoringSourcesService
} from '@rest/monitoring-sources';

import { PipelineType } from '@enums/pipeline-type.enum';
import { DateRangeType } from '@enums/date-range-type.enum';
import { PipelineProcessType } from '@enums/pipeline-process-type.enum';

import { StatisticsParamsService } from './../shared/params.service';
import { PaginationService } from './../shared/pagination.service';
import { MonitoringStatsBaseParamsModel } from './../shared/base-params.model';

export type MissingConfigsDataModel = {
	sourceAppsCountWithoutConfigs: number,
	eventIdsCountWithoutConfigs: number
};

@Component({
	selector: 'monitoring-stats-list',
	templateUrl: './list.html',
	providers: [
		MonitoringSourcesService,
		PaginationService
	]
})

export class MonitoringStatsListComponent implements OnDestroy {
	@Output() missingConfigsDataChanged = new EventEmitter<MissingConfigsDataModel>();

	private sub = new Subscription();
	private queries = new MonitoringSourcesQueriesDto();
	private opened: MonitoringSourcesModel[] = [];

	items: MonitoringSourcesModel[] = [];
	loading = false;

	pipeline: PipelineType;
	pipelineType = PipelineType;

	constructor(
		private router: Router,
		private service: MonitoringSourcesService,
		private paramsService: StatisticsParamsService,
		public pagination: PaginationService
	) {}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	fetchList() {
		this.configParams();
		this.fetch();
	}

	pageChanged(page: number) {
		const params = new MonitoringStatsBaseParamsModel();
		params.page = page;
		this.paramsService.setParams(params);
	}

	private getQueryParams(): NavigationExtras {
		const params = this.paramsService.getParams();
		const navigationExtras: NavigationExtras = {
			queryParams: {
				'dateRange': params.dateRange,
				'dateFrom': params.dateRange === DateRangeType.CUSTOM ? this.queries.dateFrom : null,
				'dateTo': params.dateRange === DateRangeType.CUSTOM ? this.queries.dateTo : null,
				'dateRangeColumnType': params.dateRangeColumnType
			}
		};

		return navigationExtras.queryParams;
	}

	private getNavigateBySource(source: string): string[] {
		const processTypeAlias = this.getProcessTypeAlias();
		const urlTree = this.router.parseUrl(this.router.url);
		const uriWithoutParams = urlTree.root.children['primary'].segments.map(it => it.path).join('/');
		const navigate = [`/${uriWithoutParams}/${source}/${processTypeAlias}`];

		return navigate;
	}

	private getProcessTypeAlias() {
		switch(this.pipeline) {
			case PipelineType.BATCH:
			case PipelineType.HISTORICAL_BATCH:
				return PipelineProcessType.getAlias(PipelineProcessType.BATCH);
			case PipelineType.REAL_TIME:
			case PipelineType.HISTORICAL_REAL_TIME:
				return PipelineProcessType.getAlias(PipelineProcessType.DATA_TRANSFER);
		}
	}

	toggleRow(item: MonitoringSourcesModel) {
		const i = this.opened.indexOf(item);
		if(!!~i) {
			this.opened.splice(i, 1);
			return;
		}
		this.opened.push(item);
	}

	openedRow(item: MonitoringSourcesModel): boolean {
		return !!~this.opened.indexOf(item);
	}

	private fetch() {
		const pipelineAlias = this.getPipelineAlias();

		this.pipeline = PipelineType.getByAlias(pipelineAlias);
		this.pagination.setPage(this.queries.page); // @TODO: temporary fix for pagination
		this.loading = true;

		const sub = this.service
			.getList(pipelineAlias, this.queries)
			.subscribe(
				data => {
					this.loading = false;
					this.items = data.content.map(item => {
						item.navigateTo = this.getNavigateBySource(item.sourceApplication);
						item.queryParams = this.getQueryParams();

						return new MonitoringSourcesModel(item);
					});
					this.pagination.init(data.pagination);

					const missingConfigsData = this.composeMissingConfigCounts(this.items);
					this.missingConfigsDataChanged.emit(missingConfigsData);
				},
				() => {
					this.items = [];
					this.loading = false;
				}
			);

		this.sub.add(sub);
	}

	private composeMissingConfigCounts(items: MonitoringSourcesModel[]) {
		const sourceAppsCountWithoutConfigs = items.filter(item => item.missingConfigsCount);
		const eventIdsCountWithoutConfigs = sourceAppsCountWithoutConfigs.reduce((previousValue: any, currentValue: MonitoringSourcesModel) => {
			previousValue.missingConfigsCount += currentValue.missingConfigsCount;
			return previousValue;
		}, {missingConfigsCount: 0});

		return {
			sourceAppsCountWithoutConfigs: sourceAppsCountWithoutConfigs.length,
			eventIdsCountWithoutConfigs: eventIdsCountWithoutConfigs.missingConfigsCount
		} as MissingConfigsDataModel;
	}

	private getPipelineAlias() {
		const urlTree = this.router.parseUrl(this.router.url);
		const segments = urlTree.root.children['primary'].segments;
		const pipelineAlias = segments[segments.length - 1].path;
		return pipelineAlias;
	}

	private configParams() {
		const params = this.paramsService.getParams();
		this.queries = new MonitoringSourcesQueriesDto(params);
	}
}
