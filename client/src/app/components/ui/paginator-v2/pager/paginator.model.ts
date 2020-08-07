import { IPagination } from '@rest/shared/page.dto';

export class PaginationV2Model implements IPagination {
	page: number;
	itemsPerPage: number;
	itemsPerPageDefault: number;
	itemsPerPageOptions: number[];
	previous: number;
	next: number;
	totalItems: number;
	totalPages: number;
	limit?: number;
	err?: string;
	first?: number;
	last?: number;

	constructor(data?: PaginationV2Model) {
		if(!data) {
			return;
		}

		this.page = data.page;
		this.previous = data.previous;
		this.next = data.next;
		this.itemsPerPage = data.itemsPerPage;
		this.itemsPerPageDefault = data.itemsPerPageDefault;
		this.itemsPerPageOptions = data.itemsPerPageOptions;
		this.totalItems = data.totalItems;
		this.totalPages = data.totalPages;
		this.limit = data.limit;
		this.err = data.err;
		this.first = data.first;
		this.last = data.last;
	}
}
