import { SortDirection } from '@enums/sort-direction.enum';

export class ColumnSortModel {
	direction: SortDirection;
	property: string;

	constructor(data?: ColumnSortModel) {
		if(!data) {
			return;
		}

		this.direction = SortDirection[data.direction];
		this.property = data.property;
	}
}
