import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

import { Timezone } from '@enums/timezone.enum';

const DefaultConstants = {
	DATE_TIME_ZONE: Timezone.UTC,
	DATE_FMT: 'MM/DD/YYYY',
	TIME_FMT: 'HH:mm:ss'
};

@Pipe({
	name: 'date'
})

export class DatePipe implements PipeTransform {
	transform(value: string, pattern = DefaultConstants.DATE_FMT, timezone= DefaultConstants.DATE_TIME_ZONE): string {
		if(!value) {
			return;
		}

		return timezone === DefaultConstants.DATE_TIME_ZONE ? moment(value).utc().format(pattern) : moment(value).format(pattern);
	}
}
