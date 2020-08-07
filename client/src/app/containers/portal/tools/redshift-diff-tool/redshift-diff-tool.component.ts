import { Component, AfterViewInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { PaginationService } from '@containers/shared/pagination.service';

import { ModalsService } from './modal/modals.service';
import { RedshiftTablesDiffModel } from './shared/redshift-tables-diff.model';

import { RedshiftTablesDiffService, RedshiftTablesDiffTableDataDto } from '@rest/redshift-tables-diff';

@Component({
	selector: 'redshift-diff-tool',
	templateUrl: './redshift-diff-tool.html',
	providers: [
		ModalsService,
		PaginationService,
		RedshiftTablesDiffService
	]
})

export class RedshiftDiffToolComponent implements AfterViewInit, OnDestroy {
	private subscriptions: Subscription[] = [];

	items: RedshiftTablesDiffModel[] = [];
	loading = false;

	constructor(
		public modalsService: ModalsService,
		private service: RedshiftTablesDiffService,
		public pagination: PaginationService
	) {}

	ngAfterViewInit() {
		this.fetch();
	}

	ngOnDestroy() {
		this.subscriptions.forEach(s => s.unsubscribe());
	}

	fetch() {
		this.loading = true;

		this.service.getList()
			.subscribe(
				resp => {
					this.items = resp.map(item => new RedshiftTablesDiffModel(item));
					this.loading = false;
				},
				() => {
					this.items = [];
					this.loading = false;
				}
			);
	}

	toggleRow(item: any) {
		item.opened = !item.opened;
	}

	openDiffTables(item: RedshiftTablesDiffModel, table: RedshiftTablesDiffTableDataDto) {
		this.modalsService.openViewModal(table.hasDifferences, item.schemaName, table.name);
	}
}
