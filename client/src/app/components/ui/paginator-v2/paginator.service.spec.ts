import { expect } from 'chai';

import { PaginatorV2Service } from './paginator.service';
import { PaginationV2Model } from './paginator.model';

describe('PaginatorV2Service', () => {
	let auth: PaginatorV2Service;

	describe('init()', () => {
		it('should return pagination data', () => {
			auth = new PaginatorV2Service();
			const paginationData = {
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
			};

			auth.configData(paginationData);

			expect(auth.get()).to.deep.equal({...paginationData, first: 1, err: undefined});
		});

		it('should return wrong calculated pagination data', () => {
			auth = new PaginatorV2Service();
			const paginationData = {
				page: 1987,
				itemsPerPage: 7,
				previous: 0,
				next: 2,
				totalItems: 13896,
				totalPages: 1986
			};

			const expectedData = {
				itemsPerPage: 7,
				itemsPerPageDefault: 10,
				page: 1987,
				itemsPerPageOptions: [10, 25, 50, 100],
				previous: 0,
				next: 0,
				totalItems: 13896,
				totalPages: 1986,
				limit: 0,
				first: 13903,
				last: 13896,
				err: undefined
			};

			auth.configData(paginationData);

			expect(auth.get()).to.deep.equal(expectedData);
		});

		it('should return default pagination data', () => {
			auth = new PaginatorV2Service();
			const paginationData = new PaginationV2Model({
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
				last: 0,
				err: undefined
			});

			expect(auth.get()).to.deep.equal(paginationData);
		});
	});

	describe('get()', () => {
		it('should return data', () => {
			auth = new PaginatorV2Service();
			const paginationData = {
				page: 17,
				itemsPerPage: 7,
				previous: 0,
				next: 2,
				totalItems: 13895,
				totalPages: 1985
			};

			const expectedData = new PaginationV2Model({
				itemsPerPage: 7,
				itemsPerPageDefault: 10,
				page: 17,
				itemsPerPageOptions: [10, 25, 50, 100],
				previous: 0,
				next: 0,
				totalItems: 13895,
				totalPages: 1985,
				limit: 0,
				first: 113,
				last: 119
			});

			auth.setSubj(paginationData);

			expect(auth.get()).to.deep.equal(expectedData);
		});
	});
});