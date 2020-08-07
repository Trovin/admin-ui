import { Component, OnInit, OnDestroy } from '@angular/core';
import { Params, ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { S3UrIBuilderUtils } from '@utils/s3-url-builder.utils';
import { PaginationService } from '@containers/shared/pagination.service';

import { PipelineProcessOperationType } from '@enums/pipeline-process-operation-type.enum';
import { PendingDetailsType } from '@enums/pending-details-type.enum';
import { PipelineProcessType } from '@enums/pipeline-process-type.enum';
import { DateRangeType } from '@enums/date-range-type.enum';

import { ParamsService } from '@containers/shared/params.service';

import { PipelinePendingDetailsService, PipelinePendingDetailsDto, PipelinePendingDetailsQueriesDto } from '@rest/monitoring-sources/pipeline-pending-details';

type PipelinePendingDetailsParamsModel = {
	dateRange: string;
	sourceApplication: string;
	process: PipelineProcessType;
	pipelineAlias: string;
	page: number;
};

@Component({
	selector: 'monitoring-pipeline-pending-details',
	templateUrl: './pending-details.html',
	providers: [
		PipelinePendingDetailsService,
		PaginationService
	]
})

export class MonitoringPipelinePendingDetailsComponent implements OnInit, OnDestroy {
	private sub: Subscription;

	private queries = new PipelinePendingDetailsQueriesDto();
	private params: PipelinePendingDetailsParamsModel = {
		dateRange: null,
		sourceApplication: null,
		process: null,
		pipelineAlias: null,
		page: null
	};

	items: PipelinePendingDetailsDto[] = [];

	loading = false;

	processOperation = PipelineProcessOperationType;
	pendingDetailsType = PendingDetailsType;

	constructor(
		protected router: Router,
		private service: PipelinePendingDetailsService,
		private paramsService: ParamsService,
		public route: ActivatedRoute,
		public pagination: PaginationService
	) {}

	ngOnInit() {
		this.sub = this.paramsService
			.getDataSubj()
			.subscribe((data: Params) => {
				this.composeData(data);
				this.configUrlParams();
				this.init();
			});
	}

	ngOnDestroy() {
		if(this.sub) {
			this.sub.unsubscribe();
		}
	}

	init(resetPage?: boolean) {
		if(resetPage) {
			this.pagination.resetPage();
		}

		this.loading = true;
		this.service
			.getList(this.params.pipelineAlias, this.queries)
			.subscribe(
				data => {
					this.loading = false;
					this.items = data.content;
					this.pagination.init(data.pagination);
				},
				() => {
					this.items = [];
					this.loading = false;
				}
			);
	}

	pageChanged(page: number) {
		this.pagination.setPage(page); // @TODO: temporary fix for pagination
		this.configUrlParams(page);
	}

	composeS3Url(item: PipelinePendingDetailsDto) {
		return S3UrIBuilderUtils.buildS3Url(item.bucketName, item.objectKey);
	}

	private configUrlParams(page?: number) {
		const queryParams: NavigationExtras = {
			queryParams: {
				'page': page || this.params.page,
				'dateRange': this.params.dateRange
			},
			relativeTo: this.route,
			queryParamsHandling: 'merge',
			replaceUrl: true
		};
		this.router.navigate(['.'], queryParams);
	}

	private composeData(data: Params) {
		const dateRange = data.dateRange || DateRangeType.LAST_24HOURS;
		const dates = DateRangeType.getDateRangeData(dateRange);

		this.params.dateRange = DateRangeType[dateRange];
		this.params.process = PipelineProcessType.getByAlias(data.process);
		this.params.sourceApplication = data.sourceApplication;
		this.params.pipelineAlias = data.pipelineAlias;
		this.params.page = +data.page || this.pagination.page;

		this.queries.dateFrom = dates.dateFrom || data.dateFrom;
		this.queries.dateTo = dates.dateTo || data.dateTo;
		this.queries.sourceApplication = this.params.sourceApplication;
		this.queries.process = this.params.process;
		this.queries.page = this.params.page;
	}
}