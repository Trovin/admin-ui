import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
	ReconciliationGroupDto,
	ReconciliationGroupService
} from '@rest/reconciliation-group';


@Component({
	selector: 'reconciliation-source-applicatons',
	templateUrl: './list.html',
	providers: [ReconciliationGroupService]
})

export class ReconciliationSourceApplicationsComponent implements OnInit {
	items: ReconciliationGroupDto[] = [];

	loading = false;

	constructor(
		private router: Router,
		private service: ReconciliationGroupService
	) {}

	ngOnInit() {
		this.fetch();
	}

	fetch() {
		this.loading = true;
		this.service
			.getList()
			.subscribe(
				(resp: ReconciliationGroupDto[]) => {
					this.loading = false;
					this.items = resp.map(i => new ReconciliationGroupDto(i));
				},
				() => {
					this.items = [];
					this.loading = false;
				}
			);
	}
}
