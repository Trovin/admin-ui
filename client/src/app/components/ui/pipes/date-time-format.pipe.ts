import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

export class Constants {
	static readonly DATE_TIME_ZONE = 'UTC';
	static readonly DATE_FMT = 'yyyy-MM-dd';
	static readonly DATE_TIME_FMT = `${Constants.DATE_FMT} HH:mm:ss`;
}

@Pipe({
	name: 'dateTimeFormat'
})
export class DateTimeFormatPipe extends DatePipe implements PipeTransform {
	transform(value: any, args?: string): any {
		return super.transform(value, args || Constants.DATE_TIME_FMT);
	}
}
