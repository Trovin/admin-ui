import { Pipe, PipeTransform } from '@angular/core';

const METRIC_SUFFIXES = ['', 'K', 'M', 'G', 'T', 'P'];
@Pipe({name: 'abbreviateNumber'})
export class AbbreviateNumberPipe implements PipeTransform {
	private result: number;
	private abbrs: string;
	private base: number;

	transform(value: number, decimals = 1): string {
		if(typeof value !== 'number' || !value) {
			return '0';
		}

		const valuePrefix = value < 0 ? '-' : null;
		const positiveValue = this.convertValueToPositive(value);

		this.base = Math.floor(Math.log(positiveValue) / Math.log(1000));
		this.result = parseFloat((positiveValue / Math.pow(1000, this.base)).toFixed(decimals)); // Converts a string to a floating-point number
		this.abbrs = METRIC_SUFFIXES[this.base];

		if(this.isResultLengthMoreThanFour()) {
			this.composeResult();
		}

		return this.abbrs ? valuePrefix + this.result + this.abbrs : valuePrefix + this.result;
	}

	private isResultLengthMoreThanFour() {
		const resultLength = this.result.toString().replace(/[.]/gi, '').length;
		return resultLength >= 4;
	}

	private convertValueToPositive(value: number) {
		return Math.abs(value);
	}

	private composeResult() {
		const isDecimalMoreHalf = this.result >= 999.5;
		if(isDecimalMoreHalf) {
			this.composeWithBoostingMetricPrefix();
		} else {
			this.result = Math.round(this.result);
		}
	}

	private composeWithBoostingMetricPrefix() {
		this.result = 1;
		this.abbrs = METRIC_SUFFIXES[this.base + 1];
	}
}
