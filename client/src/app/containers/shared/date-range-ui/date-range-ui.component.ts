import { Component, Input } from '@angular/core';

import { DateRangeType } from '@enums/date-range-type.enum';

import { ParamsService } from './../params.service';

@Component({
	selector: 'date-range-ui',
	templateUrl: './date-range-ui.html',
	providers: [ParamsService]
})

export class DateRangeUiComponent {
	@Input() dateRange: string;
	@Input() dateFrom: string;
	@Input() dateTo: string;

	dataRangeType = DateRangeType;

	timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	ngOnChanges() {
		this.configDates();
	}

	private configDates() {
		if(this.dateRange === DateRangeType.CUSTOM) {
			return;
		}
		const dates = this.dataRangeType.getDateRangeData(DateRangeType[this.dateRange]);
		this.dateFrom = dates.dateFrom;
		this.dateTo = dates.dateTo;
	}
}
