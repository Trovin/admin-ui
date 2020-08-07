import { BehaviorSubject } from 'rxjs';
import { PaginationV2Model } from './paginator.model';
import { Injectable } from '@angular/core';

interface IPaginationData {
	[key: string]: number|number[];
}

@Injectable()
export class PagerV2Service {
	private dataSubj: BehaviorSubject<PaginationV2Model>;

	pagination = new PaginationV2Model({
		itemsPerPage: 0,
		itemsPerPageDefault: 10,
		itemsPerPageOptions: [10, 25, 50, 100],
		page: 1,
		previous: 0,
		next: 0,
		totalItems: 0,
		totalPages: 0,
		limit: 0,
		first: 0,
		last: 0
	});

	constructor() {
		this.dataSubj = new BehaviorSubject(this.get());
	}

	configData(paginationData: IPaginationData) {
		if(!paginationData) {
			return;
		}

		const data = this.composeData(paginationData);
		this.pagination.page = data.page;
		this.pagination.totalItems = data.totalItems;
		this.pagination.itemsPerPageDefault = data.itemsPerPageDefault;
		this.pagination.itemsPerPage = data.itemsPerPage;
		this.pagination.totalPages = data.totalPages;
		this.pagination.first = ((data.page - 1) * this.pagination.itemsPerPage) + 1;
		this.pagination.last = this.pagination.totalItems > (this.pagination.page * this.pagination.itemsPerPage) ? this.pagination.page * this.pagination.itemsPerPage : this.pagination.totalItems;

		this.pagination.itemsPerPageOptions = [this.pagination.itemsPerPageDefault, ...this.pagination.itemsPerPageOptions]
			.map(e => typeof e === 'string' ? +e : e)
			.filter((e, index, arr) => !!e && arr.indexOf(e) === index)
			.sort((a, b) => a - b);
	}

	getSubj() {
		return this.dataSubj;
	}

	setSubj(paginationData: IPaginationData) {
		this.configData(paginationData);
		this.dataSubj.next(this.get());
	}

	get() {
		return this.pagination;
	}

	set(paginationData: IPaginationData) {
		this.configData(paginationData);
	}

	private composeData(paginationData: IPaginationData) {
		const data = Object.assign({}, this.get(), paginationData);
		return new PaginationV2Model(data);
	}
}
