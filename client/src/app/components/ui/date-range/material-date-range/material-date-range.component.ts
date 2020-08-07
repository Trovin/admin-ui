import { Component } from '@angular/core';

import { DateRangeType } from '@enums/date-range-type.enum';
import { DateRangeBaseComponent } from './../base-date-range.component';

@Component({
	selector: 'material-date-range',
	templateUrl: './material-date-range.html',
	styleUrls: ['./material-date-range.scss']
})
export class MaterialDateRangeComponent extends DateRangeBaseComponent {
	openDropdown = false;

	close() {
		super.close();
		this.openDropdown = false;
	}

	selectRangeType(event: Event, option: DateRangeType) {
		event.stopPropagation();

		this.range = option;
		this.changeRangeType();
		this.openDropdown = false;
	}
}
