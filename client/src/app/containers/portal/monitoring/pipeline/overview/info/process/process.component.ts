import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';


import { ParamsService } from '@containers/shared/params.service';
import { QueryParamsType } from '@rest/shared/query-params.type';

import { PipelineType } from '@enums/pipeline-type.enum';
import { DateRangeType } from '@enums/date-range-type.enum';
import { PipelineProcessType } from '@enums/pipeline-process-type.enum';
import { PipelineProcessOperationType } from '@enums/pipeline-process-operation-type.enum';

import {
	PipelineProcessDto,
	PipelineProcessQueriesDto,
	PipelineProcessService
} from '@rest/monitoring-sources/pipeline-process';


@Component({
	selector: 'pipeline-info-process',
	templateUrl: './process.html',
	providers: [PipelineProcessService]
})

export class PipelineInfoProcessComponent implements OnInit, OnDestroy {
	private sub: Subscription;
	private monitoringDataSub: Subscription;
	private queries: PipelineProcessQueriesDto;

	processOperationType = PipelineProcessOperationType;
	processtype = PipelineProcessType;

	auditPageQueryParams: QueryParamsType = {};
	errorDetailsPageUrl = '';
	items = new PipelineProcessDto();
	params: QueryParamsType = {};
	processTypeName = '';

	loading = false;

	constructor(
		private router: Router,
		private service: PipelineProcessService,
		private paramsService: ParamsService
	) {}

	ngOnInit() {
		this.monitoringDataSub = this.paramsService
			.getDataSubj()
			.subscribe(data => {
				this.params.process = data.process;
				this.params.pipelineAlias = data.pipelineAlias;
				this.params.sourceApplication = data.sourceApplication;
				this.params.dateRangeColumnType = data.dateRangeColumnType;

				const pipeline = PipelineType.getByAlias(data.pipelineAlias);
				const pipelineValues = PipelineType.getValues(pipeline);
				const processTypeName = PipelineProcessType.getByAlias(this.params.process);
				this.processTypeName = PipelineProcessType.getAliasUI(processTypeName);

				const dates = DateRangeType.getDateRangeData(data.dateRange);
				this.params.dateRange = dates.dateRange || data.dateRange;

				const queries = {
					sourceApplication: data.sourceApplication,
					dateFrom: dates.dateFrom || data.dateFrom,
					dateTo: dates.dateTo || data.dateTo,
					dateRangeColumnType: data.dateRangeColumnType
				};
				this.queries = new PipelineProcessQueriesDto(queries);

				this.auditPageQueryParams = this.getQueryParams();
				this.errorDetailsPageUrl = this.getErrorDetailsPageUrl();
				this.initPipelineProcess();
			});
	}

	ngOnDestroy() {
		if(this.sub) {
			this.sub.unsubscribe();
		}
		this.monitoringDataSub.unsubscribe();
	}

	private getErrorDetailsPageUrl(): string {
		const uri = `/portal/monitoring/pipelines/${this.params.pipelineAlias}/${this.params.sourceApplication}/${this.params.process}/errors-details`;
		return uri;
	}

	private getQueryParams(): QueryParamsType {
		const query: QueryParamsType = {
			'sourceApplication': [`${this.params.sourceApplication},${PipelineType.getByAlias(this.params.pipelineAlias)}`],
			'pipeline': PipelineType.getByAlias(this.params.pipelineAlias),
			'withErrorsOnly': false,
			'dateRange': this.params.dateRange,
			'dateFrom': this.params.dateRange === DateRangeType.CUSTOM ? this.queries.dateFrom : null,
			'dateTo': this.params.dateRange === DateRangeType.CUSTOM ? this.queries.dateTo : null,
			'dateRangeColumnType': this.params.dateRangeColumnType
		};

		return query;
	}

	private initPipelineProcess() {
		this.loading = true;
		this.items = new PipelineProcessDto();
		this.sub = this.service
			.get(this.params.pipelineAlias, this.params.process, this.queries)
			.subscribe(
				(data: PipelineProcessDto) => {
					this.loading = false;
					this.items = new PipelineProcessDto(data);
				},
				() => {
					this.items = new PipelineProcessDto();
					this.loading = false;
				}
			);
	}
}
