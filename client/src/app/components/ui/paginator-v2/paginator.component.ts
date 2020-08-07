import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PaginatorV2Service } from './paginator.service';
import { PaginationV2Model } from './paginator.model';

@Component({
	selector: 'paginator-v2',
	templateUrl: './paginator.html',
	styleUrls: ['./paginator.scss']
})
export class PaginatorV2Component {
	@Output() changed = new EventEmitter<never>();

	@Input() loading = false;
	@Input() boundaryLinks = false;
	@Input() itemsPerPageEnabled = false;

	maxSize = 10;

	pagination = new PaginationV2Model();

	constructor(private paginator: PaginatorV2Service) {
		this.paginator
			.getSubj()
			.subscribe((data) => {
				this.pagination = new PaginationV2Model(data);
			});
	}

	pageChanged() {
		this.paginator.set({page: this.pagination.page, itemsPerPage: this.pagination.itemsPerPage});
		this.changed.emit();
	}

	changeItemsPerPage() {
		this.pagination.page = 1;
		this.paginator.set({page: this.pagination.page, itemsPerPage: +this.pagination.itemsPerPage});
		this.changed.emit();
	}
}
