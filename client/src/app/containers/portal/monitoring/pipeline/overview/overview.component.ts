import { Component, OnInit, OnDestroy } from '@angular/core';
import { Params } from '@angular/router';

import { Subscription } from 'rxjs';

import { ParamsService } from '@containers/shared/params.service';

import { environment } from '@environments/environment';

import { PipelineType, PipelineValuesModel } from '@enums/pipeline-type.enum';
import { DateRangeType } from '@enums/date-range-type.enum';
import { PipelineProcessType } from '@enums/pipeline-process-type.enum';

import { S3UrIBuilderUtils } from '@utils/s3-url-builder.utils';

import {
	PipelineErrorsCountDto,
	PipelineErrorsCountQueriesDto,
	PipelineErrorsCountService
} from '@rest/monitoring-sources/pipeline-errors-count';
import {
	PipelinePendingEventsDto,
	PipelinePendingEventsQueriesDto,
	PipelinePendingEventsService
} from '@rest/monitoring-sources/pipeline-pending-events';

import { MonitoringPipelineOverviewModel } from './overview.model';
import { DateRangeDataModel } from '@components/ui/date-range/date-range.model';

@Component({
	selector: 'monitoring-pipeline-overview',
	templateUrl: './overview.html',
	styleUrls: ['./overview.scss'],
	providers: [
		PipelineErrorsCountService,
		PipelinePendingEventsService
	]
})

export class MonitoringPipelineOverviewComponent implements OnInit, OnDestroy {
	private sub: Subscription;
	private pipelineErrorsCountQueries: PipelineErrorsCountQueriesDto;
	private pipelinePendingEventsQueries: PipelinePendingEventsQueriesDto;
	private errorsCounts: PipelineErrorsCountDto[] = [];
	private pipelinePendingEventsCount: PipelinePendingEventsDto[] = [];

	pipelineType = PipelineType;
	processType = PipelineProcessType;

	rawDataS3UrlHistorical = S3UrIBuilderUtils.buildS3Url(environment.awsConfig.s3.historicalStageBucket, null);
	rawDataS3Url = S3UrIBuilderUtils.buildS3Url(environment.awsConfig.s3.stageBucket, null);
	intermediateS3Url = S3UrIBuilderUtils.buildS3Url(environment.awsConfig.s3.intermediateBucket, null);
	flattenedS3Url = S3UrIBuilderUtils.buildS3Url(environment.awsConfig.s3.flattenedBucket, null);
	compressedS3Url = S3UrIBuilderUtils.buildS3Url(environment.awsConfig.s3.compressedBucket, null);
	processedS3Url = S3UrIBuilderUtils.buildS3Url(environment.awsConfig.s3.processedBucket, null);

	inputBatchSTitle = 'Input Batch S3';
	inputBatchS3Url = 'https://s3.console.aws.amazon.com/s3/buckets/production-bhn-datalake-batchfiles-us-west-2/?region=us-west-2&tab=overview';

	historicalInputBatchSTitle = 'Historical Input Batch S3';
	historicalInputBatchS3Url = 'https://s3.console.aws.amazon.com/s3/buckets/production-bhn-datalake-batchfiles-historical-us-west-2/?region=us-west-2';

	batchData = new MonitoringPipelineOverviewModel();
	dataTransferData = new MonitoringPipelineOverviewModel();
	redshiftDataCopyData = new MonitoringPipelineOverviewModel();
	redshiftData = new MonitoringPipelineOverviewModel();

	params = {
		dates: new DateRangeDataModel({
			dateRange: null,
			dateFrom: null,
			dateTo: null
		}),
		sourceApplication: null,
		processAliasUi: null,
		pipelineAliasUi: null
	};

	pipelineValues: PipelineValuesModel = {
		pipeline: null,
		alias: '',
		aliasUi: '',
		isBatch: false,
		isHistorical: false
	};

	pipelineErrorsCountLoading = false;
	pendingEventsCountLoading = false;

	constructor(
		private paramsService: ParamsService,
		private service: PipelineErrorsCountService,
		private pipelinePendingEventsService: PipelinePendingEventsService
	) {}

	ngOnInit() {
		this.sub = this.paramsService
			.getDataSubj()
			.subscribe((data: Params) => {
				this.composeParams(data);
				this.composePipelineValues(data);
				this.composePipelineTitles();
				this.composeQueries(data);
				this.initTotalErrorsCount();
				this.initPendingEventsCount();
			});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	private getErrorDetailsPageUrl(name: PipelineProcessType): string {
		const process = this.processType.getAlias(name);
		const uri = `/portal/monitoring/pipelines/${this.pipelineValues.alias}/${this.pipelineErrorsCountQueries.sourceApplication}/${process}/errors-details`;
		return uri;
	}

	private getPendingEventsPageUrl(name: PipelineProcessType): string {
		const process = this.processType.getAlias(name);
		const uri = `/portal/monitoring/pipelines/${this.pipelineValues.alias}/${this.pipelineErrorsCountQueries.sourceApplication}/${process}/pending-details`;
		return uri;
	}

	private initTotalErrorsCount() {
		this.pipelineErrorsCountLoading = true;
		this.service
			.get(this.pipelineValues.alias, this.pipelineErrorsCountQueries)
			.subscribe(
				(d: PipelineErrorsCountDto[]) => {
					this.pipelineErrorsCountLoading = false;
					this.errorsCounts = d;
					this.composeErrorsCount();
					this.composeErrorsDetailsPageUrl();
				},
				() => this.pipelineErrorsCountLoading = false
			);
	}

	private initPendingEventsCount() {
		this.pendingEventsCountLoading = true;
		this.pipelinePendingEventsService
			.get(this.pipelineValues.alias, this.pipelinePendingEventsQueries)
			.subscribe(
				(d: PipelinePendingEventsDto[]) => {
					this.pendingEventsCountLoading = false;
					this.pipelinePendingEventsCount = d;
					this.composePendingEventsCount();
					this.composePendingEventsPageUrl();
				},
				() => this.pendingEventsCountLoading = false
			);
	}

	private getErrorsCount(process: PipelineProcessType) {
		const name = PipelineProcessType.getAlias(process);
		const data = this.errorsCounts.filter(i => i.name === name);
		return data.length ? data[0].totalErrorsCount : 0;
	}

	private getPendingEventsCount(process: PipelineProcessType) {
		const data = this.pipelinePendingEventsCount.filter(i => i.pipelineProcess === process);
		return data.length ? data[0].pendingEvents : 0;
	}

	private composeParams(data: Params) {
		const dates = DateRangeType.getDateRangeData(data.dateRange);
		this.params.dates.dateRange = dates.dateRange;
		this.params.dates.dateFrom = dates.dateFrom || data.dateFrom;
		this.params.dates.dateTo = dates.dateTo || data.dateTo;
		this.params.sourceApplication = data.sourceApplication;

		const pipeline = PipelineType.getByAlias(data.pipelineAlias);
		const pipelineValues = PipelineType.getValues(pipeline);
		const processTypeName = PipelineProcessType.getByAlias(data.process);
		this.params.pipelineAliasUi = pipelineValues.aliasUi;
		this.params.processAliasUi = PipelineProcessType.getAliasUI(processTypeName);
	}

	private composeQueries(data: Params) {
		const dates = DateRangeType.getDateRangeData(data.dateRange);
		const queries = {
			sourceApplication: data.sourceApplication,
			dateFrom: dates.dateFrom || data.dateFrom,
			dateTo: dates.dateTo || data.dateTo,
			dateRangeColumnType: data.dateRangeColumnType
		};
		this.pipelineErrorsCountQueries = new PipelineErrorsCountQueriesDto(queries);
		this.pipelinePendingEventsQueries = new PipelinePendingEventsQueriesDto(queries);
	}

	private composePipelineValues(data: Params) {
		const pipeline = PipelineType.getByAlias(data.pipelineAlias);
		const pipelineValues = PipelineType.getValues(pipeline);
		this.pipelineValues.pipeline = pipelineValues.pipeline;
		this.pipelineValues.alias = pipelineValues.alias;
		this.pipelineValues.isBatch = pipelineValues.isBatch;
		this.pipelineValues.isHistorical = pipelineValues.isHistorical;
	}

	private composePendingEventsCount() {
		this.batchData.pendingEventsCount = this.getPendingEventsCount(PipelineProcessType.BATCH);
		this.dataTransferData.pendingEventsCount = this.getPendingEventsCount(PipelineProcessType.DATA_TRANSFER);
		this.redshiftDataCopyData.pendingEventsCount = this.getPendingEventsCount(PipelineProcessType.REDSHIFT_DATA_COPY);
	}

	private composePendingEventsPageUrl() {
		this.batchData.pendingEventsPageUrl = this.getPendingEventsPageUrl(PipelineProcessType.BATCH);
		this.dataTransferData.pendingEventsPageUrl = this.getPendingEventsPageUrl(PipelineProcessType.DATA_TRANSFER);
		this.redshiftDataCopyData.pendingEventsPageUrl = this.getPendingEventsPageUrl(PipelineProcessType.REDSHIFT_DATA_COPY);
	}

	private composeErrorsCount() {
		this.batchData.errorsCount = this.getErrorsCount(PipelineProcessType.BATCH);
		this.dataTransferData.errorsCount = this.getErrorsCount(PipelineProcessType.DATA_TRANSFER);
		this.redshiftDataCopyData.errorsCount = this.getErrorsCount(PipelineProcessType.REDSHIFT_DATA_COPY);
	}

	private composeErrorsDetailsPageUrl() {
		this.batchData.errorDetailsPageUrl = this.getErrorDetailsPageUrl(PipelineProcessType.BATCH);
		this.dataTransferData.errorDetailsPageUrl = this.getErrorDetailsPageUrl(PipelineProcessType.DATA_TRANSFER);
		this.redshiftDataCopyData.errorDetailsPageUrl = this.getErrorDetailsPageUrl(PipelineProcessType.REDSHIFT_DATA_COPY);
	}

	private composePipelineTitles() {
		this.batchData.title = PipelineProcessType.getAliasUI(PipelineProcessType.BATCH);
		this.dataTransferData.title = PipelineProcessType.getAliasUI(PipelineProcessType.DATA_TRANSFER);
		this.redshiftDataCopyData.title = PipelineProcessType.getAliasUI(PipelineProcessType.REDSHIFT_DATA_COPY);
		this.redshiftData.title = PipelineProcessType.getAliasUI(PipelineProcessType.REDSHIFT);
	}
}
