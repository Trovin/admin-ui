import { AfterViewInit, Component, OnDestroy } from '@angular/core';

import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { Subject, Subscription, BehaviorSubject } from 'rxjs';

import { environment } from '@environments/environment';

import { S3UrIBuilderUtils } from '@utils/s3-url-builder.utils';

import { PermissionAction } from '@enums/permission-actions.enum';
import { Containers } from '@config/containers.enum';

import { PaginationService } from '@containers/shared/pagination.service';

import { alertsService } from '@components/ui';

import { GalaxyBucket } from '@enums/galaxy-bucket.enum';
import { SortDirection } from '@enums/sort-direction.enum';
import { PipelineType } from '@enums/pipeline-type.enum';
import { DateRangeType } from '@enums/date-range-type.enum';
import { SortColumnType } from '@enums/sort-column-type.enum';

import { QueryParamsType } from '@rest/shared/query-params.type';

import { BatchDataBucketFileDto, BatchDataBucketFilesQueriesDto, BatchDataBucketFilesService } from '@rest/batch-data/bucket-files';
import { ReconciliationAllFilesQueriesDto, ReconciliationFilesQueriesDto, ReconciliationFilesService } from '@rest/reconciliation-files';

import { BatchDataParamsService } from './shared/params.service';
import { BatchDataParamsModel } from './../batch-data-params.model';
import { InputFileModel } from './bucket-file.model';
import { BatchDataBaseParamsModel } from './shared/params-base.model';

@Component({
	selector: 'batch-data-tabs',
	templateUrl: './tabs.html',
	providers: [
		BatchDataBucketFilesService,
		ReconciliationFilesService,
		BatchDataParamsService,
		PaginationService
	]
})

export class BatchDataTabsComponent implements AfterViewInit, OnDestroy {
	private sub = new Subscription();

	bucket = '';
	process = '';
	bucketType = GalaxyBucket;
	bucketName = '';

	permission = PermissionAction;
	containers = Containers;

	params = new BatchDataBaseParamsModel();
	items: InputFileModel[] = [];
	headers: {[key: string]: string} = {};
	selectedItems: InputFileModel[] = [];
	isContentShown = false;
	timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	sortSubj = new BehaviorSubject<string>('');
	sortColumns = SortColumnType;
	s3UrIBuilder = S3UrIBuilderUtils;

	loading = false;
	open = false;
	reconciliationAllInProcess = false;
	reconciliationInProcess = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private service: BatchDataBucketFilesService,
		private paramsService: BatchDataParamsService,
		private reconciliationFilesService: ReconciliationFilesService,
		public pagination: PaginationService
	) {
		const subParamMap = this.route.paramMap
			.subscribe(params => {
				this.setPipelineAlias(params.get('bucket'));
				this.composeS3BucketName();
			});
		this.sub.add(subParamMap);
	}

	ngAfterViewInit() {
		const sub = this.paramsService
			.getParamsSubj()
			.subscribe((params: BatchDataBaseParamsModel) => {
				this.composeParams(params);
				if(params.sourceApplication && params.eventIds) {
					this.isContentShown = true;
					this.configSortBy(params.sort);
				}
				this.configUrlParams().subscribe(() => {
					if(params.sourceApplication && params.eventIds) {
						this.fetch();
					}
				});
			});
		this.sub.add(sub);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	isLinkActive(name: GalaxyBucket): boolean {
		const alias = GalaxyBucket.getAlias(name);
		const url = this.router.url;
		const isTabActive = url.split(/[?\/]/).some(e => e === alias);
		return isTabActive;
	}

	performSearch(params: BatchDataParamsModel) {
		this.resetSelectedItems();

		if(!params.sourceApplication || !params.eventIds) {
			this.resetData();
			return;
		}

		this.params = Object.assign({}, this.params, params);
		this.configPaginationPage(1);
		this.paramsService.setParamsSubj(this.params);
	}

	reconcileFile(item: InputFileModel) {
		item.reconciliationFileInProcess = true;
		this.reconcile(item);
	}

	reconcile(item: InputFileModel) {
		const bucket = this.bucketType.getByAlias(this.bucket);
		const body = new ReconciliationFilesQueriesDto({
			inputFileType: bucket,
			objectKeys: [item.objectKey]
		});

		this.reconciliationFilesService
			.reconcile(body)
			.subscribe(
				r => {
					item.reconciliationFileInProcess = false;
					item.reconciliationFolderInProcess = false;
					alertsService.success(r.message);
					this.fetch();
				},
				() => {
					item.reconciliationFileInProcess = false;
					item.reconciliationFolderInProcess = false;
				}
			);
	}

	reconcileSelectedFiles() {
		const body = new ReconciliationFilesQueriesDto({
			inputFileType: this.bucketType.getByAlias(this.bucket),
			objectKeys: this.selectedItems.map(i => i.objectKey)
		});

		this.setReconciliationStatus(true);
		this.reconciliationInProcess = true;

		this.reconciliationFilesService
			.reconcile(body)
			.subscribe(
				(r) => {
					this.setReconciliationStatus(false);
					this.resetSelectedItems();
					this.reconciliationInProcess = false;
					alertsService.success(r.message);
					this.fetch();
				},
				() => {
					this.setReconciliationStatus(false);
					this.reconciliationInProcess = false;
				}
			);
	}

	reconcileAll() {
		const body = new ReconciliationAllFilesQueriesDto({
			sourceApplication: this.params.sourceApplication,
			eventIds: this.params.eventIds,
			bucket: this.bucket,
			dateFrom: this.params.dateFrom,
			dateTo: this.params.dateTo,
			key: this.params.objectKey,
			reconFilter: this.params.reconFilter
		});

		this.setReconciliationStatus(true);
		this.reconciliationAllInProcess = true;

		this.reconciliationFilesService
			.reconcileAll(body)
			.subscribe(
				(r) => {
					this.setReconciliationStatus(false);
					this.resetSelectedItems();
					this.reconciliationAllInProcess = false;
					this.fetch();
					alertsService.success(r.message);
				},
				() => {
					this.setReconciliationStatus(false);
					this.reconciliationAllInProcess = false;
				}
			);
	}

	selectedFile(item: InputFileModel, target: HTMLInputElement) {
		item.selected = target.checked;
		this.selectedItems = this.items.filter(i => i.selected);
	}

	selectedAllFiles(target: HTMLInputElement) {
		this.items
			.filter(item => item.eventCount > 0)
			.forEach(item => item.selected = target.checked);
		this.selectedItems = this.items.filter(i => i.selected);
	}

	fetch() {
		this.loading = true;

		const queries = this.composeQueries();
		const sub = this.service
			.getList(this.bucket, queries)
			.subscribe(
				data => {
					this.loading = false;
					this.items = this.composeItemsList(data.content);
					this.headers = data.headers;

					this.pagination.init(data.pagination);
				},
				() => {
					this.items = [];
					this.headers = {};
					this.loading = false;
				}
			);

		this.sub.add(sub);
	}

	composeParams(params: BatchDataParamsModel) {
		this.params = new BatchDataParamsModel(params);
	}

	composeQueries() {
		return new BatchDataBucketFilesQueriesDto(this.params);
	}

	pageChanged(page: number) {
		this.configPaginationPage(page);
		this.params.page = +this.pagination.page;
		this.resetSelectedItems();
		this.configUrlParams();
		this.fetch();
	}

	changedSortBy(sort: string) {
		this.configPaginationPage(1);
		this.configSortBy(sort);
		this.configUrlParams();
		this.resetSelectedItems();
		this.fetch();
	}

	changeTab(name: GalaxyBucket) {
		const previousBucket = this.bucket;
		const bucket = GalaxyBucket.getAlias(name);

		this.setPipelineAlias(bucket);

		if(previousBucket === bucket) {
			return;
		}

		this.resetData();
		this.resetSelectedItems();
		this.configPaginationPage(1);
		this.paramsService.setParamsSubj(this.params);
	}

	private composeItemsList(resp: BatchDataBucketFileDto[]): InputFileModel[] {
		const list = resp || [];

		return list.map(dto => {
			const item = new InputFileModel(dto);
			item.auditQueryParams = this.getAuditQueryParams(dto);
			switch(GalaxyBucket.getByAlias(this.bucket)) {
				case GalaxyBucket.REAL_TIME:
					item.auditLink = '/portal/audit/data-transfer';
					break;
				case GalaxyBucket.HISTORICAL_BATCH:
				case GalaxyBucket.BATCH:
					item.auditLink = '/portal/audit/batch';
					break;
			}
			item.isReconciliationPermitted = item.eventCount > 0;
			return item;
		});
	}

	private resetSelectedItems() {
		this.selectedItems.splice(0);
	}

	private resetData() {
		this.items = [];
		this.isContentShown = false;
		const params = this.paramsService.getDefaultParams();
		this.composeParams(params);
		this.configUrlParams();
	}

	private configSortBy(sort: string) {
		const sortBy = sort || this.createDefaultSortBy();
		this.params.sort = sortBy;
		this.sortSubj.next(sortBy);
	}

	private createDefaultSortBy() {
		return `${this.sortColumns.getAlias(SortColumnType.LAST_MODIFIED)},${SortDirection.DESC}`;
	}

	private configPaginationPage(page: number) {
		this.params.page = page;
		this.pagination.page = page || this.pagination.page;
	}

	private setPipelineAlias(name: string) {
		const pipeline = GalaxyBucket.getByAlias(name);
		this.bucket = GalaxyBucket.getValues(pipeline).alias;
	}

	private composeS3BucketName() {
		const pipeline = GalaxyBucket.getByAlias(this.bucket);
		this.bucketName = GalaxyBucket.getBucketName(pipeline, environment.env);
	}

	private configUrlParams() {
		const subj = new Subject<never>();
		const queryParams: NavigationExtras = {
			queryParams: {
				'sourceApplication': this.params.sourceApplication,
				'eventIds': this.params.eventIds,
				'page': this.params.page,
				'dateRange': this.params.dateRange,
				'dateFrom': this.params.dateFrom,
				'dateTo': this.params.dateTo,
				'objectKey': this.params.objectKey,
				'sort': this.params.sort,
				'reconFilter': this.params.reconFilter
			},
			queryParamsHandling: 'merge',
			relativeTo: this.route,
			replaceUrl: true
		};
		this.router.navigate([`/portal/input-files/${this.bucket}`], queryParams).then(() => {
			subj.next();
			subj.complete();
		});

		return subj;
	}

	private getAuditQueryParams(item: InputFileModel): QueryParamsType {
		const query = {
			'sourceApplication': [`${item.sourceApplication},${PipelineType.getByAlias(this.bucket)}`],
			'eventId': item.eventId,
			'search': item.objectKey.split('/').pop(),
			'dateRange': DateRangeType.ALL,
			'reconFilter': this.params.reconFilter
		};
		return query;
	}

	private setReconciliationStatus(status: boolean) {
		this.items
			.filter(i => i.selected)
			.forEach(i => i.reconciliationFileInProcess = status);
	}
}
