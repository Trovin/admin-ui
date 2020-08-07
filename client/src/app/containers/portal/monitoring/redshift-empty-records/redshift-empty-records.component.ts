import { Component, OnDestroy } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';

import { Subscription, Subject } from 'rxjs';

import { PermissionAction } from '@enums/permission-actions.enum';
import { Containers } from '@config/containers.enum';

import { DateRangeType } from '@enums/date-range-type.enum';
import { S3UrIBuilderUtils } from '@utils/s3-url-builder.utils';

import { PaginationService } from '@containers/shared/pagination.service';
import { DateRangeDataModel } from '@components/ui/date-range/date-range.model';

import { RedshiftEmptyRecordsRouterStateParamsModel } from './shared/router-state-params.model';
import { RedshiftEmptyRecordsRouterStateParamsService } from './shared/router-state.params.service';

import {
	RedshiftEmptyRecordsQueriesDto,
	RedshiftEmptyRecordsService,
	RedshiftMetricsTablesColumnsIgnoreStateQueriesDto,
	RedshiftEmptyRecordsColumnsQueriesDto
} from '@rest/redshift-empty-records';

import { RedshiftEmptyRecordsModel } from './shared/redshift-empty-records.model';
import { RedshiftEmptyRecordColumnModel } from './shared/redshift-empty-record-column.model';
import { DateRangeColumnType } from '@enums/date-range-column-type.enum';

@Component({
	selector: 'redshift-empty-records',
	templateUrl: './redshift-empty-records.html',
	providers: [
		PaginationService,
		RedshiftEmptyRecordsService,
		RedshiftEmptyRecordsRouterStateParamsService
	]
})

export class RedshiftEmptyRecordsComponent implements OnDestroy {
	private subscriptions: Subscription[] = [];
	private sub = new Subscription();

	params = new RedshiftEmptyRecordsRouterStateParamsModel({});
	s3UrIBuilder = S3UrIBuilderUtils;
	timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	items: RedshiftEmptyRecordsModel[] = [];
	loading = false;

	permission = PermissionAction;
	containers = Containers;

	dates = new DateRangeDataModel();
	defaultDates = new DateRangeDataModel();
	exclude = [
		DateRangeType.LAST_3HOURS,
		DateRangeType.LAST_12MONTHS
	];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		public pagination: PaginationService,
		private routerStateParamsService: RedshiftEmptyRecordsRouterStateParamsService,
		private service: RedshiftEmptyRecordsService
	) {
		const sub = this.routerStateParamsService
			.getParamsSubj()
			.subscribe((params) => {
				this.composeParams(params);
				this.composeDates(params);
				this.configUrlSubj().subscribe(() => this.fetch());
			});
		this.sub.add(sub);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(s => s.unsubscribe());
		this.sub.unsubscribe();
	}

	fetch() {
		this.loading = true;

		const queries = new RedshiftEmptyRecordsQueriesDto({
			page: this.params.page,
			showIgnore: this.params.showIgnore,
			dateFrom: this.params.dateFrom,
			dateTo: this.params.dateTo,
			dateRangeColumnType: this.params.dateRangeColumnType
		});

		this.service.getTables(queries)
			.subscribe(
				resp => {
					this.items = resp.content.map(e => new RedshiftEmptyRecordsModel(e));
					this.pagination.init(resp.pagination);
					this.loading = false;
				},
				() => {
					this.items = [];
					this.loading = false;
				}
			);
	}

	fetchColumns(open: boolean, item: RedshiftEmptyRecordsModel) {
		if(!open) {
			return;
		}

		item.loading = true;
		const queries = new RedshiftEmptyRecordsColumnsQueriesDto({
			showIgnore: this.params.showIgnore,
			dateFrom: this.params.dateFrom,
			dateTo: this.params.dateTo,
			dateRangeColumnType: this.params.dateRangeColumnType
		});

		this.service.getColumns(item.location, queries)
			.subscribe(
				resp => {
					this.items.forEach((e) => {
						if(e.location === item.location) {
							e.columns = resp;
						}
					});
					item.loading = false;
				},
				() => item.loading = false
			);
	}

	toggleShowIgnoredFields(active: boolean) {
		this.params.showIgnore = active;
		this.routerStateParamsService.setParamsSubj(this.params);
	}

	toggleIgnoreState(active: boolean, item: RedshiftEmptyRecordColumnModel) {
		item.ignoreLoading = true;
		const queries = new RedshiftMetricsTablesColumnsIgnoreStateQueriesDto({
			state: active
		});

		this.service.toggleIgnoreState(item.location, item.columnName, queries)
			.subscribe(
				() => {
					item.ignoreNull = queries.state;
					item.ignoreLoading = false;
				},
				() => {
					item.ignoreNull = !queries.state;
					item.ignoreLoading = false;
				}
			);
	}

	applyDates(dates: DateRangeDataModel) {
		this.params.dateRange = dates.dateRange;
		this.params.dateFrom = dates.dateFrom;
		this.params.dateTo = dates.dateTo;

		this.routerStateParamsService.setParamsSubj(this.params);
	}

	pageChanged(page: number) {
		this.pagination.setPage(page); // @TODO: temporary fix for pagination
		this.params.page = page;
		this.routerStateParamsService.setParamsSubj(this.params);
	}

	private composeDates(params: RedshiftEmptyRecordsRouterStateParamsModel) {
		this.dates.dateRange = params.dateRange;
		this.dates.dateFrom = params.dateFrom;
		this.dates.dateTo = params.dateTo;
	}

	private composeParams(params: RedshiftEmptyRecordsRouterStateParamsModel) {
		this.params = new RedshiftEmptyRecordsRouterStateParamsModel(params);
	}

	private configUrlSubj() {
		const subj = new Subject<never>();

		const queryParams: NavigationExtras = {
			queryParams: {
				'page': this.params.page,
				'showIgnore': this.params.showIgnore,
				'dateRange': this.params.dateRange,
				'dateRangeColumnType': DateRangeColumnType.FROM_DATE
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
}
