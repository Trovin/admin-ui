import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationExtras, Params, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { S3UrIBuilderUtils } from '@utils/s3-url-builder.utils';
import { ParamsService } from '@containers/shared/params.service';
import { QueryParamsType } from '@rest/shared/query-params.type';

import { PipelineType } from '@enums/pipeline-type.enum';
import { DateRangeType } from '@enums/date-range-type.enum';
import { AuditSearchType } from '@enums/audit-search-type.enum';
import { PipelineProcessType } from '@enums/pipeline-process-type.enum';
import { DateRangeColumnType } from '@enums/date-range-column-type.enum';
import { PipelineProcessOperationType } from '@enums/pipeline-process-operation-type.enum';

import {
	PipelineErrorDetailsDto,
	PipelineErrorsDetailsService,
	PipelineErrorDetailsQueriesDto
} from '@rest/monitoring-sources/pipeline-errors-details';
import {
	PipelineErrorsGroupService,
	PipelineErrorsGroupQueriesDto
} from '@rest/monitoring-sources/pipeline-errors-group';

import { PipelineErrorsGroupModel } from './errors-group-data.model';

type MonitoringPipelineErrorDetailsQueries = {
	sourceApplication: string;
	processOperation?: PipelineProcessOperationType;
	runId?: string;
	dateRange?: DateRangeType;
	dateFrom?: string;
	dateTo?: string;
	pipeline?: PipelineType;
	shortErrorMessage?: string;
	search: string;
	searchTypes?: AuditSearchType[];
	partial?: boolean;
	dateRangeColumnType: DateRangeColumnType;
};

type MonitoringPipelineErrorDetailsParams = {
	dateRange: string;
	dateFrom: string;
	dateTo: string;
	sourceApplication: string;
	process: string;
	pipelineAlias: string;
	objectKey: string;
	bucketName: string;
	processedObjectKey: string;
};

@Component({
	selector: 'monitoring-pipeline-errors-details',
	templateUrl: './error-details.html',
	styleUrls: ['./error-details.scss'],
	providers: [
		PipelineErrorsDetailsService,
		PipelineErrorsGroupService
	]
})

export class MonitoringPipelineErrorDetailsComponent implements OnInit, OnDestroy {
	private sub = new Subscription();

	processOperationType = PipelineProcessOperationType;
	pipelineProcessType = PipelineProcessType;
	items: PipelineErrorDetailsDto[] = [];
	groupedErrorsList: PipelineErrorsGroupModel[] = [];
	params: MonitoringPipelineErrorDetailsParams = {
		dateRange: null,
		dateFrom: null,
		dateTo: null,
		sourceApplication: null,
		process: null,
		pipelineAlias: null,
		objectKey: null,
		bucketName: null,
		processedObjectKey: null
	};
	queries: MonitoringPipelineErrorDetailsQueries = {
		sourceApplication: null,
		processOperation: null,
		runId: null,
		dateFrom: null,
		dateTo: null,
		shortErrorMessage: null,
		search: null,
		searchTypes: null,
		dateRangeColumnType: null
	};

	navigateToAuditPage: string[];
	navigateToAuditPageQueryParams: QueryParamsType;

	errorsDetailsLoading = false;
	groupedErrorsLoading = false;
	isShowGroupedErrors = false;

	processTypeName = '';
	pipeline = '';

	constructor(
		private router: Router,
		protected route: ActivatedRoute,
		private service: PipelineErrorsDetailsService,
		private paramsService: ParamsService,
		private pipelineErrorsGroupService: PipelineErrorsGroupService
	) {}

	ngOnInit() {
		const sub = this.paramsService
			.getDataSubj()
			.subscribe((data: Params) => {
				this.composeData(data);
				this.initErrorsDetails();
				this.initErrorsGroup();
			});

		this.sub.add(sub);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	initErrorsGroup() {
		const queries = new PipelineErrorsGroupQueriesDto({
			sourceApplication: this.queries.sourceApplication,
			dateFrom: this.queries.dateFrom,
			dateTo: this.queries.dateTo,
			shortErrorMessage: this.queries.shortErrorMessage,
			processOperation: this.queries.processOperation,
			partial: this.queries.partial,
			dateRangeColumnType: this.queries.dateRangeColumnType,
			runId: this.queries.shortErrorMessage ? null : this.queries.runId
		});

		this.groupedErrorsList = [];

		this.setErrorsGroupLoading(true);
		this.pipelineErrorsGroupService
			.getList(this.params.pipelineAlias, this.params.process, queries)
			.subscribe(
				(data: PipelineErrorsGroupModel[]) => {
					this.setErrorsGroupLoading(false);
					this.groupedErrorsList = data.map(e => {
						e.checked = e.shortMessage === this.queries.shortErrorMessage;
						return e;
					});
				},
				() => this.setErrorsGroupLoading(false)
			);
	}

	initErrorsDetails() {
		const queries = new PipelineErrorDetailsQueriesDto({
			sourceApplication: this.queries.sourceApplication,
			dateFrom: this.queries.dateFrom,
			dateTo: this.queries.dateTo,
			shortErrorMessage: this.queries.shortErrorMessage,
			processOperation: this.queries.processOperation,
			partial: this.queries.partial,
			pipeline: this.queries.pipeline,
			dateRangeColumnType: this.queries.dateRangeColumnType,
			runId: this.queries.shortErrorMessage ? null : this.queries.runId
		});

		this.items = [];

		this.setErrorsDetailsLoading(true);
		this.service
			.getList(this.params.pipelineAlias, this.params.process, queries)
			.subscribe(
				(data: PipelineErrorDetailsDto[]) => {
					this.setErrorsDetailsLoading(false);
					this.items = data;
				},
				() => {
					this.items = [];
					this.setErrorsDetailsLoading(false);
				}
			);
	}

	addErrosGroupFilter(item: PipelineErrorsGroupModel) {
		this.queries.shortErrorMessage = item.shortMessage;
		this.queries.runId = null;
		this.queries.partial = false;
		this.configUrlParams();
	}

	clearErrosGroupFilter() {
		this.queries.shortErrorMessage = null;
		this.queries.partial = true;
		this.configUrlParams();
	}

	composeS3Url(bucketName: string, objectKey: string, processedObjectKey: string) {
		const isBatchProcess = PipelineProcessType.getByAlias(this.params.process) === PipelineProcessType.BATCH;
		const key = isBatchProcess ? processedObjectKey || objectKey : objectKey;

		return S3UrIBuilderUtils.buildS3Url(bucketName, key);
	}

	resetInputFileFilter() {
		this.queries.runId = null;
		this.configUrlParams();
	}

	protected configUrlParams() {
		const queryParams: NavigationExtras = {
			queryParams: {
				'sourceApplication': this.params.sourceApplication,
				'withErrorsOnly': true,
				'dateRange': this.params.dateRange,
				'dateFrom': this.params.dateRange === DateRangeType.CUSTOM ? this.queries.dateFrom : null,
				'dateTo': this.params.dateRange === DateRangeType.CUSTOM ? this.queries.dateTo : null,
				'runId': this.queries.runId,
				'shortErrorMessage': this.queries.shortErrorMessage,
				'search': this.queries.search,
				'partial': this.queries.partial,
				'objectKey': this.params.objectKey,
				'dateRangeColumnType': this.queries.dateRangeColumnType
			},

			relativeTo: this.route
		};
		this.router.navigate(['.'], queryParams);
	}

	private composeData(data: Params) {
		const dates = DateRangeType.getDateRangeData(data.dateRange);

		this.params.sourceApplication = data.sourceApplication;
		this.params.process = data.process;
		this.params.pipelineAlias = data.pipelineAlias;
		this.params.dateRange = data.dateRange || DateRangeType.TODAY;
		this.params.dateRange = data.dateRange || DateRangeType.TODAY;
		this.params.dateFrom = dates.dateFrom || data.dateFrom;
		this.params.dateTo = dates.dateTo || data.dateTo;
		this.params.objectKey = data.objectKey;
		this.params.bucketName = data.bucketName;
		this.params.processedObjectKey = data.processedObjectKey;

		this.queries.sourceApplication = data.sourceApplication;
		this.queries.processOperation = data.processOperation;
		this.queries.runId = data.runId;
		this.queries.partial = this.getPartialVal(data.partial);
		this.queries.shortErrorMessage = data.shortErrorMessage;
		this.queries.search = data.search;
		this.queries.searchTypes = data.searchTypes;
		this.queries.dateFrom = dates.dateFrom || data.dateFrom;
		this.queries.dateTo = dates.dateTo || data.dateTo;
		this.queries.dateRangeColumnType = data.dateRangeColumnType;

		this.navigateToAuditPage = this.getNavigateToAuditPage();
		this.navigateToAuditPageQueryParams = this.getNavigateToAuditPageQueryParams();


		if(data.pipelineAlias) {
			const pipeline = PipelineType.getByAlias(data.pipelineAlias);
			const processTypeName = PipelineProcessType.getByAlias(data.process);
			this.pipeline = PipelineType.getAliasUI(pipeline);
			this.processTypeName = PipelineProcessType.getAliasUI(processTypeName);
		}
	}

	private getPartialVal(value: string) {
		switch(value) {
			case 'true':
				return true;
			case 'false':
				return false;
			default:
				return true;
		}
	}

	private setErrorsDetailsLoading(status: boolean) {
		this.errorsDetailsLoading = status;
	}

	private setErrorsGroupLoading(status: boolean) {
		this.groupedErrorsLoading = status;
	}

	private getNavigateToAuditPage(): string[] {
		return ['/portal', 'audit', this.params.process];
	}

	private getNavigateToAuditPageQueryParams(): QueryParamsType {
		const query = {
			'sourceApplication': [`${this.params.sourceApplication},${PipelineType.getByAlias(this.params.pipelineAlias)}`],
			'withErrorsOnly': true,
			'dateRange': this.params.dateRange,
			'dateFrom': this.queries.dateFrom,
			'dateTo': this.queries.dateTo,
			'search': this.queries.shortErrorMessage || this.queries.search,
			'partial': this.queries.partial,
			'dateRangeColumnType': this.queries.dateRangeColumnType
		};
		return query;
	}
}
