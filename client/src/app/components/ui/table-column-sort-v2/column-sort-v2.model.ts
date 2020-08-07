import { SortDirection } from '@enums/sort-direction.enum';

export class ColumnSortV2Model {
	direction: string;
	property: string;
	group: string[];

	constructor(data?: ColumnSortV2Model) {
		if(!data) {
			return;
		}

		this.direction = SortDirection[data.direction];
		this.property = data.property;
		this.group = data.group;
	}
}
