import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from 'chai';

import { SharedModule } from '@components/shared/shared.module';

import { ColumnSortComponent } from './column-sort.component';
import { SortDirection } from '@enums/sort-direction.enum';


describe('ColumnSortComponent', () => {
	let component: ColumnSortComponent;
	let fixture: ComponentFixture<ColumnSortComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				SharedModule
			],
			declarations: [ ColumnSortComponent ]
		});
		fixture = TestBed.createComponent(ColumnSortComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	describe('composeSortByData()', () => {
		it('should return composed sort data', () => {
			expect(component.composeSortByData('START_TIME,DESC')).to.deep.equal({
				property: 'START_TIME',
				direction: 'DESC'
			});
		});

		it('should return composed sort data with undefined properties / sort argument doesn\'t exist', () => {
			expect(component.composeSortByData(null)).to.deep.equal({
				property: undefined,
				direction: undefined
			});
		});
	});

	describe('composeSortBy()', () => {
		it('should return composed sort data', () => {
			expect(component.composeSortBy(null)).to.deep.equal('');
		});

		it('should return composed sort data / sort argument doesn\'t exist', () => {
			expect(component.composeSortBy({
				property: 'START_TIME',
				direction: SortDirection.DESC
			})).to.deep.equal('START_TIME,DESC');
		});
	});

	describe('conigSortDirection()', () => {
		it('should set direction without switchs / when prevous direction is DEFAULT', () => {
			component.conigSortDirection(SortDirection.DESC);
			expect(component.sort.direction).to.equal(SortDirection.DESC);
		});

		it('should switch direction / when previos direction is not DEFAULT', () => {
			component.sort.direction = SortDirection.ASC;
			component.conigSortDirection(SortDirection.DESC);
			expect(component.sort.direction).to.equal(SortDirection.ASC);
		});

		it('should set direction to DEFAULT / when argument is null', () => {
			component.conigSortDirection(null);
			expect(component.sort.direction).to.equal(SortDirection.DEFAULT);
		});
	});

	describe('syncSortStatus()', () => {
		it('should set sort data / when argument is exist', () => {
			component.sortBy = 'START_TIME';
			component.syncSortStatus('START_TIME,DESC');
			expect(component.sort).to.deep.equal({
				property: 'START_TIME',
				direction: SortDirection.DESC
			});
		});

		it('should set sort data to DEFAULT / sort property argument is different', () => {
			component.sortBy = 'RAW_FILE_CREATED_TIME';
			component.sort.property = 'RAW_FILE_CREATED_TIME';
			component.syncSortStatus('START_TIME,DESC');

			expect(component.sort).to.deep.equal({
				property: 'RAW_FILE_CREATED_TIME',
				direction: SortDirection.DEFAULT
			});
		});
	});

	it('should leave direction / when argument is null', () => {
		component.sortBy = 'START_TIME';
		component.sort.property = 'START_TIME';
		component.syncSortStatus(null);
		expect(component.sort).to.deep.equal({
			property: 'START_TIME',
			direction: SortDirection.DEFAULT
		});
	});
});