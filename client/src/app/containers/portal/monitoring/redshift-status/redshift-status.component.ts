import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { RedshiftStatusDto, RedshiftStatusService } from '@rest/redshift-status';
import { MonitoringQueryStatusModel } from './redshift-query.model';

@Component({
	selector: 'redshift-status',
	templateUrl: './redshift-status.html',
	providers: [RedshiftStatusService]
})

export class MonitoringRedshiftStatusComponent implements OnInit, OnDestroy {
	private sub = new Subscription();

	items: RedshiftStatusDto[] = [];
	queriesItems: MonitoringQueryStatusModel[] = [];
	timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	isLoadingStatusData = false;
	isLoadingQueriesStatusesData = false;

	constructor( private service: RedshiftStatusService) {}

	ngOnInit() {
		this.fetch();
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	fetch() {
		this.isLoadingStatusData = true;
		this.isLoadingQueriesStatusesData = true;

		const status = this.service
			.getStatus()
			.subscribe(
				resp => {
					this.isLoadingStatusData = false;
					this.items = resp;
				},
				() => {
					this.items = [];
					this.isLoadingStatusData = false;
				}
			);

		this.sub.add(status);

		const queriesStatuses = this.service
			.getQueriesStatuses()
			.subscribe(
				resp => {
					this.isLoadingQueriesStatusesData = false;
					this.queriesItems = resp;
				},
				() => {
					this.queriesItems = [];
					this.isLoadingQueriesStatusesData = false;
				}
			);

		this.sub.add(queriesStatuses);
	}

	refresh() {
		this.fetch();
	}

	showMore(item: MonitoringQueryStatusModel) {
		item.isShowMore = true;
	}
}
