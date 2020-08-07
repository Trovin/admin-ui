import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';

import { PaginationService } from '@containers/shared/pagination.service';

import { ReconciliationDto, ReconciliationService } from '@rest/reconciliation';
import { ReconciliationQueriesDto } from '@rest/reconciliation/reconciliation.queries.dto';

import { DateRangeType } from '@enums/date-range-type.enum';

import { ReconciliationBaseModel } from './../shared/reconciliation-base.model';

import { ReconciliationFormComponent } from './../form/form.component';

@Component({
	selector: 'reconciliation-details',
	templateUrl: './details.html',
	providers: [
		ReconciliationService,
		PaginationService
	]
})

export class ReconciliationDetailsComponent implements OnInit {
	@ViewChild(ReconciliationFormComponent, {static: true}) form: ReconciliationFormComponent;

	params = new ReconciliationBaseModel({
		page: 1
	});
	items: ReconciliationDto[] = [];

	timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	loading = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private service: ReconciliationService,
		public pagination: PaginationService
	) {}

	ngOnInit() {
		this.fetchList();
	}

	fetchList() {
		this.configParams();
		this.fetch();
	}

	performSearch() {
		this.resetPage();
		this.configParams(1);
		this.fetch();
	}

	pageChanged(page: number) {
		this.pagination.setPage(page); // @TODO: temporary fix for pagination
		this.configParams(page);
		this.fetch();
	}

	private fetch() {
		const queries = this.getQueries();
		this.loading = true;
		this.service
			.getList(queries)
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

	private resetPage() {
		this.pagination.setPage(1);
		this.params.page = 1;
	}

	private getQueries() {
		const params = Object.assign({}, this.params);
		return new ReconciliationQueriesDto(params);
	}

	private configParams(currentPage?: number) {
		const params = this.route.snapshot.queryParams;
		const page = currentPage || params.page;
		this.params = Object.assign({}, this.params, this.form.params, { page });
		this.configUrlParams();
	}

	protected configUrlParams() {
		const queryParams: NavigationExtras = {
			queryParams: {
				'page': this.params.page || 1,
				'dateRange': this.params.dateRange,
				'dateFrom': this.params.dateRange === DateRangeType.CUSTOM ? this.params.dateFrom : null,
				'dateTo': this.params.dateRange === DateRangeType.CUSTOM ? this.params.dateTo : null,
				'eventType': this.params.eventType,
				'sourceApplication': this.params.sourceApplication,
				'withDiscrepancy': this.params.withDiscrepancy
			},
			relativeTo: this.route,
			replaceUrl: true
		};
		this.router.navigate(['.'], queryParams);
	}
}
