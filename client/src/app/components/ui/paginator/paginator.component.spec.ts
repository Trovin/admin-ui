import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from 'chai';

import { PaginationModule } from 'ngx-bootstrap/pagination';

import { SharedModule } from '@components/shared/shared.module';

import { PaginatorComponent } from './paginator.component';


describe('PaginatorComponent', () => {
	let component: PaginatorComponent;
	let fixture: ComponentFixture<PaginatorComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				SharedModule,
				FormsModule,
				PaginationModule.forRoot()
			],
			declarations: [ PaginatorComponent ]
		});
		fixture = TestBed.createComponent(PaginatorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	describe('initData()', () => {
		it('initData / page 1', () => {
			component.page = 1;
			component.itemsPerPage = 10;
			component.totalItems = 23;
			component.ngOnChanges();
			fixture.detectChanges();

			expect(component.pagination).to.deep.equal({
				page: 1,
				maxSize: 10,
				itemsPerPage: 10,
				totalItems: 23,
				startIndex: 1,
				endIndex: 10
			});
		});

		it('initData / page 34', () => {
			component.page = 34;
			component.itemsPerPage = 7;
			component.totalItems = 400;
			component.ngOnChanges();
			fixture.detectChanges();

			expect(component.pagination).to.deep.equal({
				page: 34,
				maxSize: 10,
				itemsPerPage: 7,
				totalItems: 400,
				startIndex: 232,
				endIndex: 238
			});
		});
	});
});
