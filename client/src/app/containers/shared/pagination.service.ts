import { IPagination } from '@rest/shared/page.dto';
import { Injectable } from '@angular/core';

@Injectable()
export class PaginationService {
	page = 1;
	totalItems = 0;
	itemsPerPage = 7;
	totalPages = 0;

	init(paginationData?: IPagination) {
		if(!paginationData) {
			return;
		}

		this.totalItems = paginationData.totalItems;
		this.itemsPerPage = paginationData.itemsPerPage || 7;
		this.totalPages = paginationData.totalPages;
		this.page = paginationData.page;
	}

	getPage(): number {
		return this.page;
	}

	setPage(page: number) {
		this.page = page;
	}

	resetPage() {
		this.page = 1;
	}
}
