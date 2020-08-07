import * as moment from 'moment';

import { Timezone } from './timezone.enum';

export type DateRange = {
	dateRange: DateRangeType;
	dateFrom: string;
	dateTo: string;
	period?: number;
	format?: string;
};

export enum DateRangeType {
	ALL = 'ALL',
	TODAY = 'TODAY',
	LAST_HOUR = 'LAST_HOUR',
	LAST_3HOURS = 'LAST_3HOURS',
	LAST_24HOURS = 'LAST_24HOURS',
	LAST_7DAYS = 'LAST_7DAYS',
	LAST_30DAYS = 'LAST_30DAYS',
	LAST_12MONTHS = 'LAST_12MONTHS',
	CUSTOM = 'CUSTOM'
}

export namespace DateRangeType {
	export function values(): DateRangeType[] {
		return [
			DateRangeType.ALL,
			DateRangeType.TODAY,
			DateRangeType.LAST_HOUR,
			DateRangeType.LAST_3HOURS,
			DateRangeType.LAST_24HOURS,
			DateRangeType.LAST_7DAYS,
			DateRangeType.LAST_30DAYS,
			DateRangeType.LAST_12MONTHS,
			DateRangeType.CUSTOM
		];
	}

	export enum properties {
		ALL = 'Show All',
		TODAY = 'Today',
		LAST_HOUR = 'Last Hour',
		LAST_3HOURS = 'Last 3 hours',
		LAST_24HOURS = 'Last 24 hours',
		LAST_7DAYS = 'Last 7 days',
		LAST_30DAYS = 'Last 30 days',
		LAST_12MONTHS = 'Last 12 months',
		CUSTOM = 'Custom'
	}

	export function getDateRangeData(dateRangeType = DateRangeType.TODAY, timezone = Timezone.UTC): DateRange {
		const exclude = [DateRangeType.CUSTOM, DateRangeType.ALL];

		const dateRange: DateRange = {
			dateRange: dateRangeType,
			dateFrom: null,
			dateTo: null,
			period: null
		};

		if(!~exclude.indexOf(dateRangeType)) {
			dateRange.dateFrom = DateRangeType.getDateFrom(dateRangeType, timezone);
			dateRange.dateTo = DateRangeType.getDate(null, timezone);
			dateRange.period = this.getPeriod(dateRangeType);
			dateRange.format = this.getFormat(dateRangeType);
		}

		return dateRange;
	}

	export function getUTCDate(date?: number|string|Date): string {
		const miliseconds = new Date(date).valueOf(); // @TODO: http://momentjs.com/guides/#/warnings/js-date/
		return date ? moment(miliseconds).utc().format() : moment().utc().format();
	}

	export function getLocalDate(date?: number|string|Date): string {
		const miliseconds = new Date(date).valueOf(); // @TODO: http://momentjs.com/guides/#/warnings/js-date/
		return date ? moment(miliseconds).format() : moment().format();
	}

	export function getDate(date: number|string|Date, timezone?: Timezone): string {
		return timezone === Timezone.UTC ? DateRangeType.getUTCDate(date) : DateRangeType.getLocalDate(date);
	}

	export function getSubtractDate(date: number|string|Date, amount: number, unitOfTime: string, timezone?: Timezone): string {
		return DateRangeType.getDate(moment(date).subtract(amount, unitOfTime).valueOf(), timezone);
	}

	export function getDateFrom(dateRangeType: DateRangeType, timezone: Timezone): string {
		switch(dateRangeType) {
			case DateRangeType.TODAY:
				return DateRangeType.getDate(moment().startOf('day').valueOf(), timezone);
			case DateRangeType.LAST_HOUR:
				return DateRangeType.getDate(moment().subtract(1, 'hour').valueOf(), timezone);
			case DateRangeType.LAST_3HOURS:
				return DateRangeType.getDate(moment().subtract(3, 'hour').valueOf(), timezone);
			case DateRangeType.LAST_24HOURS:
				return DateRangeType.getDate(moment().subtract(1, 'day').valueOf(), timezone);
			case DateRangeType.LAST_7DAYS:
				return DateRangeType.getDate(moment().subtract(7, 'day').valueOf(), timezone);
			case DateRangeType.LAST_30DAYS:
				return DateRangeType.getDate(moment().subtract(30, 'day').valueOf(), timezone);
			case DateRangeType.LAST_12MONTHS:
				return DateRangeType.getDate(moment().subtract(12, 'months').valueOf(), timezone);
			default:
				return null;
		}
	}

	export function getPeriod(dateRangeType: DateRangeType): number {
		switch(dateRangeType) {
			case DateRangeType.LAST_HOUR:
				return 600; // 10 minutes
			case DateRangeType.LAST_3HOURS:
				return 600; // 10 minutes
			case DateRangeType.TODAY:
				return 3600; // 1 hour
			case DateRangeType.LAST_24HOURS:
				return 3600; // 1 hour
			case DateRangeType.LAST_7DAYS:
				return 86400; // 1 day
			case DateRangeType.LAST_30DAYS:
				return 86400; // 1 day
			case DateRangeType.LAST_30DAYS:
				return 86400; // 1 day
			case DateRangeType.LAST_12MONTHS:
				return 86400; // 1 day, 2592000 = 30 days
			default:
				return null;
		}
	}

	export function getFormat(dateRangeType: DateRangeType): string {
		switch(dateRangeType) {
			case DateRangeType.LAST_HOUR:
				return 'h:mm';
			case DateRangeType.LAST_3HOURS:
				return 'h:mm';
			case DateRangeType.TODAY:
				return 'M/D/YY, h:mm a';
			case DateRangeType.LAST_24HOURS:
				return 'M/D/YY, h:mm a';
			case DateRangeType.LAST_7DAYS:
				return 'M/DD/YY';
			case DateRangeType.LAST_30DAYS:
				return 'M/DD/YY';
			case DateRangeType.LAST_12MONTHS:
				return 'MMM YYYY';
			default:
				return null;
		}
	}

	export function propertiesMap(): Map<string, string> {
		const propsMap = new Map();
		DateRangeType.values()
			.forEach(prop => propsMap.set(prop, DateRangeType.properties[prop]));
		return propsMap;
	}
}
