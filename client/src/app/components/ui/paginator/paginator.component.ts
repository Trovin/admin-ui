import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'paginator',
	templateUrl: './paginator.html',
	styleUrls: ['./paginator.scss']
})
export class PaginatorComponent implements OnChanges {
	@Output() changed = new EventEmitter<{page: number, itemsPerPage: number}>();

	@Input() loading = false;
	@Input() boundaryLinks = false;
	@Input() itemsPerPageEnabled = false;
	@Input() itemsPerPageOptions = [10, 25, 50, 100];
	@Input() itemsPerPage = 10;
	@Input() maxSize = 10;
	@Input() page = 1;
	@Input() totalItems = 0;

	pagination = {
		page: 1,
		maxSize: 0,
		itemsPerPage: 0,
		totalItems: 0,
		startIndex: 0,
		endIndex: 0
	};

	ngOnChanges() {
		this.initData();
	}

	initData() {
		this.pagination.page = this.page;
		this.pagination.maxSize = this.maxSize;
		this.pagination.totalItems = this.totalItems;
		this.pagination.itemsPerPage = this.itemsPerPage;
		this.pagination.startIndex = ((this.pagination.page - 1) * this.pagination.itemsPerPage) + 1;
		this.pagination.endIndex = this.pagination.totalItems > (this.pagination.page * this.pagination.itemsPerPage) ? this.pagination.page * this.pagination.itemsPerPage : this.pagination.totalItems;
		this.itemsPerPageOptions = [this.itemsPerPage, ...this.itemsPerPageOptions]
			.filter((i, index, arr) => arr.indexOf(i) === index)
			.sort((a, b) => a - b);
	}

	pageChanged() {
		this.changed.emit({page: +this.pagination.page, itemsPerPage: +this.pagination.itemsPerPage});
	}

	changeItemsPerPage() {
		this.changed.emit({page: 1, itemsPerPage: +this.pagination.itemsPerPage});
	}
}
