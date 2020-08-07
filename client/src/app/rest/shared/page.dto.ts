export interface IPagination {
	page?: number;
	itemsPerPage?: number;
	previous?: number;
	next?: number;
	totalItems?: number;
	totalPages?: number;
	limit?: number;
	err?: string;
}

export class PageDto<T> {
	content: T[] = [];
	pagination: IPagination;
	headers?: {[key: string]: string};

	constructor(data?: PageDto<T>) {
		if(!data) {
			return;
		}

		this.content = data.content;
		this.pagination = data.pagination;
		this.headers = data.headers;
	}
}
