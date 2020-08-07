import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

import { Subject, Subscription } from 'rxjs';

import { DateRangeType } from '@enums/date-range-type.enum';

import { RedshiftTablesSummaryService, RedshiftTablesSummaryQueriesDto } from '@rest/redshift/tables-summary';

import { MonitoringPostProcessingSummaryParamsModel } from './shared/params.model';
import { MonitoringPostProcessingSummaryParamsService } from './shared/params.service';

import { MonitoringPostProcessingSummaryModel } from './summary.model';

@Component({
	selector: 'post-processing-summary',
	templateUrl: './summary.html',
	providers: [
		RedshiftTablesSummaryService,
		MonitoringPostProcessingSummaryParamsService
	]
})

export class MonitoringPostProcessingSummaryComponent implements OnInit, OnDestroy {
	private sub = new Subscription();
	private params = new MonitoringPostProcessingSummaryParamsModel();

	items: MonitoringPostProcessingSummaryModel[] = [];
	loading = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private service: RedshiftTablesSummaryService,
		private paramsService: MonitoringPostProcessingSummaryParamsService
	) {}

	ngOnInit() {
		const sub = this.paramsService
			.getParamsSubj()
			.subscribe((params) => {
				if(!params.schemaType) {
					return;
				}
				this.composeParams(params);
				this.configUrlSubj().subscribe(() => this.fetchList());
			});
		this.sub.add(sub);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	refresh() {
		const params = this.paramsService.getParams();
		this.composeParams(params);
		this.fetchList();
	}

	fetchList() {
		const queries = new RedshiftTablesSummaryQueriesDto();
		queries.schemaType = this.params.schemaType;
		queries.dateFrom = this.params.dateFrom;
		queries.dateTo = this.params.dateTo;

		this.loading = true;

		this.service.getList(queries)
			.subscribe(
				resp => {
					this.items = resp.map(item => {
						return new MonitoringPostProcessingSummaryModel({
							tableName: item.tableName,
							errorsCount: item.errorsCount,
							isDateColumnExist: item.isDateColumnExist,
							navigateTo: ['/portal/monitoring/post-processing/summary/errors'],
							queryParams: this.getQueryParams(item.tableName)
						});
					});
					this.loading = false;
				},
				() => {
					this.items = [];
					this.loading = false;
				}
			);
	}

	private composeParams(params: MonitoringPostProcessingSummaryParamsModel) {
		this.params.dateFrom = params.dateFrom;
		this.params.dateTo = params.dateTo;
		this.params.dateRange = params.dateRange;
		this.params.schemaType = params.schemaType;
	}

	private getQueryParams(tableName: string): NavigationExtras {
		const params = this.paramsService.getParams();
		const navigationExtras: NavigationExtras = {
			queryParams: {
				'schemaType': params.schemaType,
				'table': tableName,
				'dateRange': params.dateRange,
				'dateFrom': params.dateRange === DateRangeType.CUSTOM ? this.params.dateFrom : null,
				'dateTo': params.dateRange === DateRangeType.CUSTOM ? this.params.dateTo : null
			}
		};

		return navigationExtras.queryParams;
	}

	private configUrlSubj() {
		const subj = new Subject<never>();

		const queryParams: NavigationExtras = {
			queryParams: {
				'schemaType': this.params.schemaType,
				'dateRange': this.params.dateRange,
				'dateFrom': this.params.dateRange === DateRangeType.CUSTOM ? this.params.dateFrom : null,
				'dateTo': this.params.dateRange === DateRangeType.CUSTOM ? this.params.dateTo : null
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
