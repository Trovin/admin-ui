import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';

import { Subscription, Subject } from 'rxjs';

import { S3UrIBuilderUtils } from '@utils/s3-url-builder.utils';

import { PermissionAction } from '@enums/permission-actions.enum';
import { Containers } from '@config/containers.enum';

import { BucketType } from '@enums/bucket-type.enum';
import { SortDirection } from '@enums/sort-direction.enum';
import { SortColumnType } from '@enums/sort-column-type.enum';

import { PaginationService } from '@containers/shared/pagination.service';
import { PaginatorV2Service } from '@components/ui/paginator-v2/paginator.service';

import { alertsService } from '@components/ui';
import { ColumnSortV2Model } from '@components/ui/table-column-sort-v2';
import { DropdownItemPickerModel } from '@components/ui/dropdown-item-picker/dropdown-item-picker.model';
import { DropdownItemPickerComponent } from '@components/ui/dropdown-item-picker/dropdown-item-picker.component';

import { ReconciliationService, ReconciliationStateDto } from '@rest/reconciliation';

import { BaseResponseDto } from '@rest/shared/base-response.dto';

import { SourceCatalogQueriesDto, SourceCatalogService, SourceCatalogSourceApplicationsDto, SourceCatalogModel } from '@rest/source-catalog';

import { SourceCatalogRouterStateParamsModel } from './shared/router-state-params.model';
import { SourceCatalogRouterStateParamsService } from './shared/router-state.params.service';

@Component({
	selector: 'source-catalog',
	templateUrl: './source-catalog.html',
	providers: [
		PaginationService,
		SourceCatalogRouterStateParamsService,
		ReconciliationService,
		SourceCatalogService
	]
})

export class SourceCatalogComponent implements AfterViewInit {
	@ViewChild('sourceApps', {static: true}) sourceApps: DropdownItemPickerComponent;

	private sub = new Subscription();
	private params = new SourceCatalogQueriesDto();

	bucketType = BucketType;
	items: SourceCatalogModel[] = [];
	loading = false;

	permission = PermissionAction;
	containers = Containers;

	sortSubj = new Subject<string[]>();
	sortColumns = SortColumnType;
	sortableItems = [
		new ColumnSortV2Model({
			property: SortColumnType.SOURCE_APP,
			direction: SortDirection.ASC,
			group: []
		}),
		new ColumnSortV2Model({
			property: SortColumnType.EVENT_ID,
			direction: SortDirection.ASC,
			group: []
		}),
		new ColumnSortV2Model({
			property: SortColumnType.APPLIED_DATE,
			direction: SortDirection.ASC,
			group: []
		})
	];

	sourceAppListSubj = new Subject<DropdownItemPickerModel[]>();

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private routerStateParamsService: SourceCatalogRouterStateParamsService,
		private reconciliationService: ReconciliationService,
		private service: SourceCatalogService,
		private pagination: PaginatorV2Service
	) {}

	ngAfterViewInit() {
		const paginationData = {
			itemsPerPageDefault: 7,
			page: this.route.snapshot.queryParams.page,
			itemsPerPage: this.route.snapshot.queryParams.itemsPerPage
		};

		this.configPaginationData(paginationData);
		this.initSourceApplications();

		const sub = this.routerStateParamsService
			.getParamsSubj()
			.subscribe((params) => {
				this.composeParams(params);
				this.initSortBy();
				this.configUrlSubj().subscribe(() => this.fetch());
			});
		this.sub.add(sub);
	}

	fetch() {
		const queries = new SourceCatalogQueriesDto({
			page: this.params.page,
			itemsPerPage: this.params.itemsPerPage,
			sort: this.params.sort,
			sourceApplication: this.params.sourceApplication
		});

		this.loading = true;

		this.service.getList(queries)
			.subscribe(
				resp => {
					this.loading = false;
					this.items = resp.content;

					this.pagination.setSubj({
						page: resp.pagination.page,
						itemsPerPage: resp.pagination.itemsPerPage,
						previous: resp.pagination.previous,
						next: resp.pagination.next,
						totalItems: resp.pagination.totalItems,
						totalPages:resp.pagination.totalPages
					});
				},
				() => {
					this.items = [];
					this.loading = false;
				}
			);
	}

	pageChanged() {
		this.params = new SourceCatalogQueriesDto({...this.params, ...this.pagination.get()});
		this.routerStateParamsService.setParamsSubj(this.params);
	}

	changedSortBy(sort: string[]) {
		this.params.sort = sort;
		this.configPaginationData({page: 1});
		this.routerStateParamsService.setParamsSubj(this.params);
	}

	changeSourceApp(val: DropdownItemPickerModel) {
		!val.value ? this.changeSourceAppParam(null) : this.changeSourceAppParam(val.name);
		this.configPaginationData({page: 1});

		this.routerStateParamsService.setParamsSubj(this.params);
	}

	switchConfigState(active: boolean, item: SourceCatalogModel) {
		const queries = new ReconciliationStateDto({
			sourceApplication: item.sourceApplication,
			eventId: item.eventId,
			active: active
		});

		item.disabled = true;
		item.loading = true;
		item.isReconActive = active;

		this.reconciliationService.toggleState(queries)
			.subscribe(
				(resp: BaseResponseDto) => {
					alertsService.success(resp.message);
					item.disabled = false;
					item.loading = false;
					item.isReconActive = active;
				},
				() => {
					item.disabled = false;
					item.loading = false;
					item.isReconActive = !active;
				}
			);
	}

	composeS3Url(type: BucketType, item: SourceCatalogModel) {
		let key = `${item.sourceApplication}/${item.eventId}`;

		if(BucketType.BATCH === type) {
			key = item.sourceApplication;
		}

		if(BucketType.STAGE === type) {
			key = item.isBatch ? `batchdata/${item.sourceApplication}/${item.eventId}` : item.sourceApplication.toLowerCase();
		}

		return S3UrIBuilderUtils.buildS3Url(BucketType.getBucketName(type), `${key}/`);
	}

	private configPaginationData(data: {[key: string]: number}) {
		this.pagination.setSubj(data);
	}

	private initSourceApplications() {
		this.configSourceAppsStatuses(true, true);

		this.service
			.getSourceApplications()
			.subscribe(
				resp => {
					this.composeSourceApplications(resp);
					this.configSourceAppsStatuses(false, false);
				},
				() => this.configSourceAppsStatuses(false, false)
			);
	}

	private composeSourceApplications(resp: SourceCatalogSourceApplicationsDto[]) {
		const bucketList = resp.map(e => {
			return {
				name: e.name,
				value: {name: e.name},
				checked: e.name === this.params.sourceApplication
			};
		});

		this.sourceAppListSubj.next(bucketList);
	}

	private changeSourceAppParam(val: string) {
		this.params.sourceApplication = val;
	}

	private initSortBy() {
		this.params.sort ? this.setSortSubj(this.params.sort) : this.createDefaultSortBy();
	}

	private setSortSubj(sort: string[]) {
		this.sortSubj.next(sort);
	}

	private createDefaultSortBy() {
		const sort = [`${ this.sortColumns.SOURCE_APP},${SortDirection.ASC}`, `${ this.sortColumns.APPLIED_DATE},${SortDirection.DESC}`];
		this.setSortSubj(sort);
	}

	private composeParams(params: SourceCatalogRouterStateParamsModel) {
		this.params.page = params.page;
		this.params.sort = params.sort;
		this.params.itemsPerPage = params.itemsPerPage;
		this.params.sourceApplication = params.sourceApplication;
	}

	private configUrlSubj() {
		const subj = new Subject<never>();

		const queryParams: NavigationExtras = {
			queryParams: {
				'page': this.params.page,
				'itemsPerPage': this.params.itemsPerPage,
				'sort': this.params.sort,
				'sourceApplication': this.params.sourceApplication
			},
			queryParamsHandling: 'merge',
			relativeTo: this.route,
			replaceUrl: true
		};

		this.router.navigate(['.'], queryParams)
			.then(() => {
				subj.next();
				subj.complete();
			});

		return subj;
	}

	private configSourceAppsStatuses(loading: boolean, disabled: boolean) {
		this.sourceApps.loading = loading;
		this.sourceApps.disabled = disabled;
	}
}
