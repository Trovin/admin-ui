import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { RedshiftTablesDiffService } from '@rest/redshift-tables-diff';

@Component({
	selector: 'diff-modal',
	templateUrl: './diff-modal.html',
	styleUrls: ['./diff-modal.scss'],
	providers: [
		RedshiftTablesDiffService
	]
})
export class DiffModalComponent implements OnInit, OnDestroy {
	private sub = new Subscription();

	@Input() schema = null;
	@Input() table = null;
	@Input() hasDifferences = false;

	originalText = '';
	secondaryText = '';
	loading = false;

	constructor(
		public bsModalRef: BsModalRef,
		private service: RedshiftTablesDiffService
	) {}

	ngOnInit() {
		this.fetchDiff();
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	private fetchDiff() {
		this.loading = true;

		const sub = this.service
			.getDifferences(this.schema, this.table)
			.subscribe(
				resp => {
					this.originalText = resp.integrationSchema;
					this.secondaryText = resp.productionSchema;
					this.loading = false;
				},
				() => this.loading = false
			);

		this.sub.add(sub);
	}
}
