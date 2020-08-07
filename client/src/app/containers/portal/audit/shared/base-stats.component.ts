import { AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';

import { filter } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Containers } from '@config/containers.enum';
import { PermissionAction } from '@enums/permission-actions.enum';

import { S3UrIBuilderUtils } from '@utils/s3-url-builder.utils';

import { ModalEventType } from '@enums/modal-event-type';
import { DateRangeType } from '@enums/date-range-type.enum';
import { DateRangeColumnType } from '@enums/date-range-column-type.enum';

import { alertsService } from '@components/ui';

import { AuditStatsBaseQueriesDto, AuditStatsBaseDto } from '@rest/audit/shared/stats-base';
import { AuditHideService, AuditHideQueriesDto } from '@rest/audit-hide';
import { AuditReplayDto, AuditReplayQueriesDto, AuditReplayService } from '@rest/audit-replay';

import { PaginatorV2Service } from '@components/ui/paginator-v2/paginator.service';
import { IConfirmationInitialState, ConfirmationComponent } from '@components/ui/confirmation/confirmation.component';

import { SortDirection } from '@enums/sort-direction.enum';
import { AuditSearchType } from '@enums/audit-search-type.enum';

import { AuditStatsBaseModel } from './base-stats.model';
import { AuditStatsBaseFormComponent } from './form/form.component';

export interface IErrorsPageQueryParams {
	sourceApplication: string;
	withErrorsOnly: boolean;
	runId: string;
	objectKey: string;
	bucketName: string;
	processedObjectKey: string;
	dateRange: DateRangeType;
	dateFrom: string;
	dateTo: string;
	dateRangeColumnType: string;
	partial: boolean;
	search: string;
	searchTypes: AuditSearchType[];
	sort: string;
}

export interface IErrorsDetailsPageModel {
	errorDetailsLink: string;
	errorDetailsParams: IErrorsPageQueryParams;
}

export class BaseStatsComponent implements AfterViewInit, OnDestroy {
	@ViewChild(AuditStatsBaseFormComponent, {static: true}) form: AuditStatsBaseFormComponent;

	private routerSub = Subscription.EMPTY;
	private hideSubj = new Subject<never>();

	service = null;
	replayService: AuditReplayService = null;
	hideService: AuditHideService = null;
	modalService: BsModalService = null;
	sortSubj = new Subject<string>();

	dateRangeColumnType = DateRangeColumnType;

	timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	permission = PermissionAction;
	containers = Containers;

	params = new AuditStatsBaseModel();
	opened: any[] = [];

	loading = false;

	constructor(
		protected router: Router,
		protected route: ActivatedRoute,
		private pagination: PaginatorV2Service
	) {}

	ngAfterViewInit() {
		const paginationData = {
			itemsPerPageDefault: 7,
			page: this.route.snapshot.queryParams.page,
			itemsPerPage: this.route.snapshot.queryParams.itemsPerPage
		};
		const sort = this.route.snapshot.queryParams.sort;

		this.configPaginationData(paginationData);
		this.configSortBy(sort);
		this.configData();
	}

	ngOnDestroy() {
		this.routerSub.unsubscribe();
		this.hideSubj.unsubscribe();
	}

	setModalService(modalService: BsModalService) {
		this.modalService = modalService;
	}

	setResolveService<T>(service: T) {
		this.service = service;
	}

	setReplayService(service: AuditReplayService) {
		this.replayService = service;
	}

	setHideService(service: AuditHideService) {
		this.hideService = service;
	}

	configData() {
		this.configParams();
		this.configUrlParams()
			.subscribe(() => this.fetch());
	}

	performSearch() {
		this.configSortBy(null);
		this.configPaginationData({page: 1});
		this.configData();
	}

	pageChanged() {
		this.configData();
	}

	fetch() {
		const params = this.getRequestQueries();

		this.loading = true;
		this.service
			.getList(params)
			.subscribe(data => {
					this.loading = false;
					this.onFetch(data.content);
					this.pagination.setSubj(data.pagination);
				},
				() => {
					this.loading = false;
					this.onFetch([]);
				}
			);
	}

	changedSortBy(sort: string) {
		this.configSortBy(sort);
		this.configPaginationData({page: 1});
		this.configData();
	}

	protected composeS3Url(bucketName: string, objectKey: string) {
		return S3UrIBuilderUtils.buildS3Url(bucketName, objectKey);
	}

	private configSortBy(sort: string) {
		this.params.sort = sort || this.createDefaultSortBy();
		this.sortSubj.next(this.params.sort);
	}

	private createDefaultSortBy() {
		return `${this.form.params.dateRangeColumnType},${SortDirection.DESC}`;
	}

	private configPaginationData(data: {[key: string]: number}) {
		this.pagination.setSubj(data);
	}

	private configParams() {
		this.params = new AuditStatsBaseModel({...this.params, ...this.form.params, ...this.pagination.get()});
	}

	private getRequestQueries() {
		const params = {...this.params};
		params.search = params.searchTypes && params.searchTypes.length ? params.search : null;
		return new AuditStatsBaseQueriesDto(params);
	}

	private onHideModal(modalRef: BsModalRef, cb: Function) {
		const events = [ModalEventType.DECLINE, ModalEventType.ESC, ModalEventType.BACKDROPCLICK];
		const sub = (<ConfirmationComponent>modalRef.content).changed
			.pipe(
				filter(i => {
					const evenType = ModalEventType.getByAlias(i);
					if(!evenType || !!~events.indexOf(evenType)) {
						sub.unsubscribe();
						return false;
					}
					return true;
				})
			)
			.subscribe(() => {
				sub.unsubscribe();
				cb();
			});
	}

	private showModal(initialState?: Object): BsModalRef {
		return this.modalService.show(ConfirmationComponent, {initialState});
	}

	private getHideSubj() {
		return this.hideSubj;
	}

	protected onFetch(list: any[]) {}

	protected toggleRow(item: any) {
		const i = this.opened.indexOf(item);
		if(!!~i) {
			this.opened.splice(i, 1);
			return;
		}
		this.opened.push(item);
	}

	protected openedRow(item: any): boolean {
		return !!~this.opened.indexOf(item);
	}

	protected replay<T>(item: T, process: string) {
		const params = new AuditReplayQueriesDto();
		params.runId = item['runId'];
		params.bucketName = item['bucketName'];
		params.objectKey = item['objectKey'];

		item['replayInProcess'] = true;

		this.replayService
			.put(process, [params])
			.subscribe(
				(r: AuditReplayDto) => {
					item['replayInProcess'] = false;
					alertsService.success(r.message);
				},
				() => item['replayInProcess'] = false
			);
	}

	protected hide<T>(item: T, process: string) {
		const params = new AuditHideQueriesDto();
		params.runIds = [item['runId']];

		item['hideInProcess'] = true;

		this.hideService
			.put(process, params)
			.subscribe(
				(r: AuditReplayDto) => {
					item['hideInProcess'] = false;
					alertsService.success(r.message);
					this.hideSubj.next();
					this.hideSubj.complete();
				},
				() => item['hideInProcess'] = false
			);
	}

	protected composeErrorsDetailsPageParams(item: AuditStatsBaseDto, process: string): IErrorsDetailsPageModel {
		if(!item.pipeline || !item.sourceApplication) {
			return {} as IErrorsDetailsPageModel;
		}

		return {
			errorDetailsLink: `/portal/monitoring/pipelines/${item.pipeline}/${item.sourceApplication}/${process}/errors-details`,
			errorDetailsParams: {
					'sourceApplication': item.sourceApplication,
					'withErrorsOnly': true,
					'runId': item.runId,
					'objectKey': item.objectKey,
					'bucketName': item.bucketName,
					'processedObjectKey': item.processedObjectKey,
					'dateRange': this.params.dateRange,
					'dateFrom': this.params.dateRange === DateRangeType.CUSTOM ? this.params.dateFrom : null,
					'dateTo': this.params.dateRange === DateRangeType.CUSTOM ? this.params.dateTo : null,
					'dateRangeColumnType': this.params.dateRangeColumnType,
					'partial': this.params.partial,
					'search': this.params.search,
					'searchTypes': this.params.searchTypes,
					'sort': this.params.sort
			}
		};
	}

	protected configUrlParams() {
		const subj = new Subject<never>();

		const queryParams: NavigationExtras = {
			queryParams: {
				'page': this.params.page,
				'dateRange': this.params.dateRange,
				'dateFrom': this.params.dateRange === DateRangeType.CUSTOM ? this.params.dateFrom : null,
				'dateTo': this.params.dateRange === DateRangeType.CUSTOM ? this.params.dateTo : null,
				'search': this.params.search,
				'searchTypes': this.params.searchTypes,
				'sourceApplication': this.params.sourceApplication,
				'pipeline': this.params.pipeline,
				'withErrorsOnly': this.params.withErrorsOnly,
				'dateRangeColumnType': this.params.dateRangeColumnType,
				'eventId': this.params.eventId,
				'partial': this.params.partial,
				'sort': this.params.sort,
				'itemsPerPage': this.params.itemsPerPage
			},
			relativeTo: this.route,
			replaceUrl: true
		};

		this.router.navigate(['.'], queryParams).then(() => {
			subj.next();
			subj.complete();
		});

		return subj;
	}

	protected openConfirmHideItem<T>(item: T, process: string) {
		const initialState: IConfirmationInitialState = {};
		initialState.messageWithHtml = 'Do you want to hide file?';
		const modalRef = this.showModal(initialState);
		(<ConfirmationComponent>modalRef.content).showConfirmationModal();
		this.onHideModal(modalRef, () => {
			this.getHideSubj().subscribe(() => this.fetch());
			this.hide(item, process);
		});
	}
}
