import { Pipe, PipeTransform } from '@angular/core';
import { TimeUnit } from '@enums/time-unit.enum';

const timeFormatUnits = [
	{ abbr: 'd ', value: 24 },
	{ abbr: 'h ', value: 60 },
	{ abbr: 'm ', value: 60 },
	{ abbr: 's ', value: 60 }
];

type TimeFormatUnit = {
	abbr: string;
	value: number;
};

@Pipe({
	name:'timeFormat'
})

export class TimeFormatPipe implements PipeTransform {
	private seconds: number;

	transform(value: number, unit: string) {
		if(typeof value !== 'number' || !isFinite(value) || value <=0) {
			return '-';
		}

		switch(unit) {
			case TimeUnit.MICROSECOND:
				this.seconds = value / 1000000;
				break;
			case TimeUnit.MILLISECOND:
				this.seconds = value / 1000;
				break;
			default:
				break;
		}

		const days = this.seconds / 60 / 60 / 24;
		let result = '';

		timeFormatUnits.reduce((value: number, timeFormatUnit: TimeFormatUnit): number => {
			const integer = Math.floor(value);
			const remainderPart = (value - integer) * timeFormatUnit.value;

			if(integer) {
				result += integer + timeFormatUnit.abbr;
			}

			return remainderPart;
		}, days);

		if(!result) {
			return '-';
		}

		return result;
	}
}
