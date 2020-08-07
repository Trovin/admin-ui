import { Component, ViewChild, OnDestroy } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { ModalDirective } from 'ngx-bootstrap/modal';

import { Subject, Subscription } from 'rxjs';

import { PaginationService } from '@containers/shared/pagination.service';

import { DateRangeType } from '@enums/date-range-type.enum';

import { RedshiftDdlService, RedshiftDdlDto, RedshiftDdlQueriesDto } from '@rest/redshift-ddl';

import { MonitoringRedshiftDdlParamsService } from './shared/params.service';
import { MonitoringRedshiftDdlParamsModel } from './shared/params.model';

@Component({
	selector: 'redshift-ddl',
	templateUrl: './redshift-ddl.html',
	providers: [
		RedshiftDdlService,
		PaginationService,
		MonitoringRedshiftDdlParamsService
	]
})

export class MonitoringRedshiftDdlComponent implements OnDestroy {
	@ViewChild(ModalDirective, {static: true}) modal: ModalDirective;

	private sub = new Subscription();
	private params = new MonitoringRedshiftDdlParamsModel();

	items: RedshiftDdlDto[] = [];
	timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	loading = false;
	ddlText = '';

	constructor(
		private router: Router,
		private paramsService: MonitoringRedshiftDdlParamsService,
		public pagination: PaginationService,
		private service: RedshiftDdlService
	) {
		const sub = this.paramsService
			.getParamsSubj()
			.subscribe((params) => {
				this.composeParams(params);
				this.configUrlSubj().subscribe(() => this.fetch());
			});
		this.sub.add(sub);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	fetch() {
		const queries = new RedshiftDdlQueriesDto(this.paramsService.getQueries());

		this.loading = true;

		this.service.getList(queries)
			.subscribe(
				(resp) => {
					this.loading = false;
					this.items = resp.content;
					this.pagination.init(resp.pagination);
				},
				() => {
					this.items = [];
					this.loading = false;
				}
			);
	}

	pageChanged(page: number) {
		this.pagination.setPage(page); // @TODO: temporary fix for pagination
		this.params.page = page;
		this.paramsService.setParamsSubj(this.params);
	}

	openModal(ddlText: string) {
		this.ddlText = ddlText;
		this.modal.show();
	}

	performSearch(params: MonitoringRedshiftDdlParamsModel) {
		this.composeParams(params);
		this.pagination.setPage(1); // @TODO: temporary fix for pagination
		this.paramsService.setParamsSubj(this.params);
	}

	private composeParams(params: MonitoringRedshiftDdlParamsModel) {
		this.params.page = params.page;
		this.params.search = params.search;
		this.params.dateRangeColumnType = params.dateRangeColumnType;
		this.params.dateRange = params.dateRange;
		this.params.dateFrom = params.dateFrom;
		this.params.dateTo = params.dateTo;
	}

	private configUrlSubj() {
		const subj = new Subject<never>();
		const queryParams: NavigationExtras = {
			queryParams: {
				'page': this.params.page,
				'search': this.params.search,
				'dateRangeColumnType': this.params.dateRangeColumnType,
				'dateRange': this.params.dateRange,
				'dateFrom': this.params.dateRange === DateRangeType.CUSTOM ? this.params.dateFrom : null,
				'dateTo': this.params.dateRange === DateRangeType.CUSTOM ? this.params.dateTo : null
			},
			queryParamsHandling: 'merge',
			replaceUrl: true
		};

		this.router.navigate(['/portal/monitoring/redshift-ddl'], queryParams)
			.then(() => {
				subj.next();
				subj.complete();
			});

		return subj;
	}
}
