import { AuditStatsBaseFormModel } from './form/form.model';
import { IPagination } from '@rest/shared/page.dto';

export class AuditStatsBaseModel extends AuditStatsBaseFormModel implements IPagination {
	page: number;
	itemsPerPage: number;
	totalItems: number;
	totalPages: number;
	previous: number;
	next: number;
	sort?: string;

	constructor(data?: AuditStatsBaseModel) {
		super(data);
		if(!data) {
			return;
		}

		this.page = data.page;
		this.itemsPerPage = data.itemsPerPage;
		this.totalItems = data.totalItems;
		this.totalPages = data.totalPages;
		this.previous = data.previous;
		this.next = data.next;
		this.sort = data.sort;
	}
}
