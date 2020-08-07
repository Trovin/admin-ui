import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

import { Subject, Subscription } from 'rxjs';

import { PaginationService } from '@containers/shared/pagination.service';

import { DateRangeType } from '@enums/date-range-type.enum';

import { PageDto } from '@rest/shared/page.dto';

import { RedshiftTablesService, RedshiftTablesQueriesDto } from '@rest/redshift/tables';

import { MonitoringPostProcessingErrorParamsModel } from './shared/params.model';
import { MonitoringPostProcessingErrorsParamsService } from './shared/params.service';

@Component({
	selector: 'post-processing-errors',
	templateUrl: './errors.html',
	providers: [
		PaginationService,
		RedshiftTablesService
	]
})

export class MonitoringPostProcessingErrorsComponent implements OnInit, OnDestroy {
	private sub = new Subscription();
	private params = new MonitoringPostProcessingErrorParamsModel();

	tableData = new PageDto();
	tableTitles: string[] = [];
	loading = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private service: RedshiftTablesService,
		private paramsService: MonitoringPostProcessingErrorsParamsService,
		public pagination: PaginationService
	) {}

	ngOnInit() {
		const sub = this.paramsService
			.getParamsSubj()
			.subscribe((params) => {
				if(!params.schemaType || !params.schema || !params.table) {
					return;
				}
				this.pagination.setPage(params.page);
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
		const queries = new RedshiftTablesQueriesDto();
		queries.schemaType = this.params.schemaType;
		queries.schema = this.params.schema;
		queries.table = this.params.table;
		queries.page = this.params.page;
		queries.dateFrom = this.params.dateFrom;
		queries.dateTo = this.params.dateTo;
		queries.dateRangeColumn = this.params.dateRangeColumn;

		this.loading = true;

		this.service.getList(queries)
			.subscribe(
				data => {
					this.tableData.content = this.composeTableDataContent(data.content);
					this.pagination.init(data.pagination);
					this.loading = false;
				},
				() => this.loading = false
			);
	}

	composeTableDataContent(content: {[key: string]: string|number}[]) {
		return content.map((item) => {
			return Object.keys(item)
				.sort((current: string, next: string) => this.tableTitles.indexOf(current) - this.tableTitles.indexOf(next))
				.map((key) => {
					return {
						[key]: item[key]
					};
				}).reduce((obj, item) => {
					const key = Object.keys(item)[0];
					obj[key] = item[key];
					return obj;
				}, {});
		});
	}

	tableTitlesChanged(titles: string[] = []) {
		this.tableTitles = titles;
	}

	pageChanged(page: number) {
		const params = new MonitoringPostProcessingErrorParamsModel();
		params.page = page;
		this.paramsService.setParams(params);
	}

	private composeParams(params: MonitoringPostProcessingErrorParamsModel) {
		this.params.dateFrom = params.dateFrom;
		this.params.dateTo = params.dateTo;
		this.params.dateRange = params.dateRange;
		this.params.page = params.page;
		this.params.schemaType = params.schemaType;
		this.params.schema = params.schema;
		this.params.table = params.table;
		this.params.dateRangeColumn = params.dateRangeColumn;
	}

	private configUrlSubj() {
		const subj = new Subject<never>();

		const queryParams: NavigationExtras = {
			queryParams: {
				'dateRangeColumn': this.params.dateRangeColumn,
				'schemaType': this.params.schemaType,
				'schema': this.params.schema,
				'table': this.params.table,
				'page': this.params.page,
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
