import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SortDirection } from '@enums/sort-direction.enum';

import { ColumnSortV2Model } from './column-sort-v2.model';

@Component({
	selector: 'column-sort-v2',
	templateUrl: './column-sort-v2.html'
})

export class ColumnSortV2Component implements OnInit, OnDestroy {
	@Output() changed = new EventEmitter<string[]>();

	@Input() sortByObservable: Observable<string[]>;
	@Input() sortBy: string;
	@Input() sortableItems: ColumnSortV2Model[] = [];

	private sortSubj = new Subject<ColumnSortV2Model[]>();
	private items: ColumnSortV2Model[] = [];
	private switchCount = 0;

	sortDirection = SortDirection;
	isASC = false;
	isDESC = false;
	order = 0;

	ngOnInit() {
		this.sortByObservable
			.pipe(takeUntil(this.sortSubj))
			.subscribe(sort => {
				this.items = this.composeItems(sort);

				this.composeProperties();
			});
	}

	ngOnDestroy() {
		this.sortSubj.next();
		this.sortSubj.complete();
	}

	changeSort(direction: SortDirection) {
		const item = this.items.find(e => e.property === this.sortBy);
		let data: ColumnSortV2Model = null;

		if(item) {
			this.switchCount += 1;
			data = item;
		} else {
			this.switchCount = 0;
			data = new ColumnSortV2Model({
				property: this.sortBy,
				direction: direction,
				group: this.sortableItems.find(e => e.property === this.sortBy).group
			});
		}

		this.configSort(data);
		this.changed.emit(this.composeOutputItems());
	}

	private configSort(data: ColumnSortV2Model) {
		const isElementExist = this.items.some(e => e.property === data.property);
		const isElementInGroup = this.items.some(e => !!~e.group.indexOf(data.property));

		if(isElementExist) {
			this.items
				.filter(e => (e.property === data.property))
				.forEach(e => e.direction = data.direction === SortDirection.DEFAULT ? data.direction : this.switchSortDirection(data.direction));
		} else if(isElementInGroup) {
			this.items
				.filter(e => !!~e.group.indexOf(data.property))
				.forEach(e => {
					e.property = this.sortBy;
					e.direction = data.direction === SortDirection.DEFAULT ? data.direction : this.switchSortDirection(data.direction);
				});
		} else {
			this.items.push(data);
		}
	}

	private switchSortDirection(changedDirection: string) {
		const direction = this.switchCount === 2 ? SortDirection.DEFAULT : changedDirection;

		switch(direction) {
			case SortDirection.ASC:
				return SortDirection.DESC;
			case SortDirection.DESC:
				return SortDirection.ASC;
			default:
				return SortDirection.DEFAULT;
		}
	}

	private composeProperties() {
		this.isASC = this.items
			.filter(e => e.property === this.sortBy)
			.some(e => e.direction === this.sortDirection.ASC);

		this.isDESC = this.items
			.filter(e => e.property === this.sortBy)
			.some(e => e.direction === this.sortDirection.DESC);

		const item = this.items.find(e => e.property === this.sortBy);
		this.order = this.items.length > 1 ? this.items.indexOf(item) + 1 : 0;
	}

	private composeOutputItems() {
		return this.items
			.filter(e => e.direction !== SortDirection.DEFAULT)
			.map(e => `${e.property},${e.direction}`);
	}

	private composeItems(sort: string[]): ColumnSortV2Model[] {
		return sort.map(e => {
			const element = e.split(',');
			const property = element[0];
			const direction = element[1];
			const elementModel = this.sortableItems.find(e => e.property === property);

			return new ColumnSortV2Model({
				property: property,
				direction: SortDirection[direction],
				group: elementModel.group
			});
		});
	}
}
