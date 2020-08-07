import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Subscription } from 'rxjs';

import { PaginationV2Model } from './paginator.model';
import { PagerV2Service } from './pager.service';

@Component({
	selector: 'pager-v2',
	templateUrl: './pager.html',
	styleUrls: ['./pager.scss']
})
export class PagerComponent {
	@Output() changed = new EventEmitter<never>();

	@Input() loading = false;
	@Input() itemsPerPageEnabled = false;

	private sub = new Subscription();

	maxSize = 10;
	pagination = new PaginationV2Model();

	constructor(private pager: PagerV2Service) {
		const sub = this.pager
			.getSubj()
			.subscribe((data) => {
				this.pagination = new PaginationV2Model(data);
			});

		this.sub.add(sub);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	pageChanged(value: PaginationV2Model) {
		this.pager.set({page: value.page, itemsPerPage: value.itemsPerPage});
		this.changed.emit();
	}

	changeItemsPerPage() {
		this.pager.set({page: 1, itemsPerPage: +this.pagination.itemsPerPage});
		this.changed.emit();
	}
}
