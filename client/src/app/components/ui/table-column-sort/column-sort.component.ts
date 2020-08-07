import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, HostBinding } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SortDirection } from '@enums/sort-direction.enum';

import { ColumnSortModel } from './column-sort.model';

@Component({
	selector: 'column-sort',
	templateUrl: './column-sort.html'
})

export class ColumnSortComponent implements OnInit, OnDestroy {
	@Output() changed = new EventEmitter<string>();

	@Input() sortByObservable: Subject<string> = new Subject<string>();
	@Input() sortBy: string;

	sort = new ColumnSortModel({
		direction: SortDirection.DEFAULT,
		property: this.sortBy
	});
	sortSubj = new Subject<ColumnSortModel>();
	sortDirection = SortDirection;

	ngOnInit() {
		this.sortByObservable
			.pipe(takeUntil(this.sortSubj))
			.subscribe(sortBy => {
				this.syncSortStatus(sortBy);
			});
	}

	ngOnDestroy() {
		this.sortSubj.next();
		this.sortSubj.complete();
	}

	syncSortStatus(sortBy: string) {
		if(!sortBy) {
			return;
		}

		const sort = this.composeSortByData(sortBy);

		if(this.isReInitSort(sort)) {
			this.configSortProperty();
			this.conigSortDirection(sort.direction);
		}

		if(this.sortBy !== sort.property) {
			this.setSortDirection(SortDirection.DEFAULT);
		}
	}

	private isReInitSort(sort: ColumnSortModel): boolean {
		return this.sortBy === sort.property && this.sort.direction !== sort.direction;
	}

	setSortDirection(direction: SortDirection) {
		this.sort.direction = direction;
	}

	conigSortDirection(changedDirection: string) {
		const switchFlag = this.sort.direction !== SortDirection.DEFAULT;

		switch(changedDirection) {
			case SortDirection.ASC:
				this.setSortDirection(switchFlag ? SortDirection.DESC : SortDirection.ASC);
				break;
			case SortDirection.DESC:
				this.setSortDirection(switchFlag ? SortDirection.ASC : SortDirection.DESC);
				break;
			default:
				this.setSortDirection(SortDirection.DEFAULT);
		}
	}

	private configSortProperty() {
		this.sort.property = this.sortBy;
	}

	composeSortBy(sort: ColumnSortModel): string {
		if(!sort || sort.direction === SortDirection.DEFAULT) {
			return '';
		}
		return `${sort.property},${sort.direction}`;
	}

	composeSortByData(sortBy: string): ColumnSortModel {
		const sortingParamsList = sortBy ? sortBy.split(',') : [];
		return new ColumnSortModel({
			property: sortingParamsList[0],
			direction: SortDirection[sortingParamsList[1]]
		});
	}

	changeSort(direction: SortDirection) {
		this.configSortProperty();
		this.conigSortDirection(direction);
		this.changed.emit(this.composeSortBy(this.sort));
	}
}
