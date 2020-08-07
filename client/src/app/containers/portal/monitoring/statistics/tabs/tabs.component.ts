import { Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

import { Subject, Subscription } from 'rxjs';

import { DateRangeType } from '@enums/date-range-type.enum';
import { PipelineType } from '@enums/pipeline-type.enum';

import { StatisticsParamsService } from './shared/params.service';
import { MonitoringStatsBaseParamsModel } from './shared/base-params.model';

import { MonitoringStatsFormComponent } from './form/form.component';
import { MissingConfigsDataModel, MonitoringStatsListComponent } from './list/list.component';

@Component({
	selector: 'monitoring-stats-tabs',
	templateUrl: './tabs.html',
	providers: [StatisticsParamsService]
})

export class MonitoringStatsTabsComponent implements OnInit, OnDestroy {
	@ViewChild(MonitoringStatsFormComponent, {static: true}) form: MonitoringStatsFormComponent;
	@ViewChild(MonitoringStatsListComponent, {static: true}) listComponentRef: MonitoringStatsListComponent;

	private sub = new Subscription();
	private params = new MonitoringStatsBaseParamsModel();
	private pipelineAlias = PipelineType.getValues(PipelineType.REAL_TIME).alias;

	pipelineType = PipelineType;

	missingConfigsData: MissingConfigsDataModel = {
		sourceAppsCountWithoutConfigs: 0,
		eventIdsCountWithoutConfigs: 0
	};

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private paramsService: StatisticsParamsService
	) {
		const subParamMap = this.route.paramMap
			.subscribe(params => this.setPipelineAlias(params.get('pipelineAlias')));
		this.sub.add(subParamMap);
	}

	ngOnInit() {
		const sub = this.paramsService
			.getParamsSubj()
			.subscribe((params) => {
				this.composeParams(params);
				this.configUrlSubj().subscribe(() => this.listComponentRef.fetchList());
			});
		this.sub.add(sub);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	isLinkActive(name: PipelineType): boolean {
		const alias = PipelineType.getAlias(name);
		const url = this.router.url;
		const isTabActive = url.split(/[?\/]/).some(e => e === alias);
		return isTabActive;
	}

	changeTab(name: PipelineType) {
		const pipelineAlias = PipelineType.getAlias(name);
		const params = new MonitoringStatsBaseParamsModel();
		params.page = 1;

		this.setPipelineAlias(pipelineAlias);
		this.paramsService.setParams(params);
	}

	composeMissingConfigsData(data: MissingConfigsDataModel) {
		this.missingConfigsData.sourceAppsCountWithoutConfigs = data.sourceAppsCountWithoutConfigs;
		this.missingConfigsData.eventIdsCountWithoutConfigs = data.eventIdsCountWithoutConfigs;
	}

	private setPipelineAlias(name: string) {
		const pipline = PipelineType.getByAlias(name);
		this.pipelineAlias = PipelineType.getValues(pipline).alias;
	}

	private composeParams(params: MonitoringStatsBaseParamsModel) {
		this.params = {...this.params, ...params};
	}

	private configUrlSubj() {
		const subj = new Subject<never>();

		const queryParams: NavigationExtras = {
			queryParams: {
				'page': this.params.page,
				'dateRange': this.params.dateRange,
				'dateFrom': this.params.dateRange === DateRangeType.CUSTOM ? this.params.dateFrom : null,
				'dateTo': this.params.dateRange === DateRangeType.CUSTOM ? this.params.dateTo : null,
				'dateRangeColumnType': this.params.dateRangeColumnType
			},
			queryParamsHandling: 'merge',
			replaceUrl: true
		};

		this.router.navigate([`/portal/monitoring/pipelines/${this.pipelineAlias}`], queryParams)
			.then(() => {
				subj.next();
				subj.complete();
			});

		return subj;
	}
}
