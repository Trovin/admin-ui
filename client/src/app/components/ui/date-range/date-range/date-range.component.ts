import { Component, ViewEncapsulation } from '@angular/core';

import { DateRangeBaseComponent } from './../base-date-range.component';

@Component({
	selector: 'date-range',
	templateUrl: './date-range.html',
	styleUrls: ['./date-range.scss'],
	encapsulation: ViewEncapsulation.Emulated
})
export class DateRangeComponent extends DateRangeBaseComponent {}
