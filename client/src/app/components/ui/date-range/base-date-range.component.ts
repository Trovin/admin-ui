import { EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges, Directive } from '@angular/core';

import { DateRangeType, DateRange } from '@enums/date-range-type.enum';

export class DateRangeBaseComponent implements OnInit, OnChanges {
	@Output() valuesChanged = new EventEmitter<DateRange>();

	@Input() data: DateRange = null;
	@Input() insideGroup = false;
	@Input() exclude: string[] = [];
	@Input() fieldId = '';
	@Input() options: string[] = DateRangeType.values();
	@Input() localeProperties: Map<string, string> = DateRangeType.propertiesMap();
	@Input() disabled = false;
	@Input() defaultData: DateRange = null;
	@Input() fixedWidth = false;

	private maxRange = 90*24*60*60*1000; // 90 days

	dateFormat: string;

	open = false;

	range: DateRangeType;
	from: Date;
	to: Date;

	min: Date = null;
	max: Date = null;

	constructor() {
		this.dateFormat = 'MM/dd/yy';
	}

	ngOnInit() {
		if(this.exclude.length) {
			this.options = this.options.filter(o => {
				return !~this.exclude.indexOf(o);
			});
		}
		const data: DateRange = this.defaultData;
		this.defaultData = Object.assign({}, this.data, data);
		this.updateWith(this.data);
	}

	ngOnChanges(changes: SimpleChanges) {
		if((changes['data'] && !changes['data'].firstChange)) {
			this.updateWith(this.data);
		}
	}

	updateWith(data: DateRange) {
		this.range = data.dateRange || this.defaultData.dateRange;
		if(this.range !== DateRangeType.CUSTOM) {
			this.from = new Date();
			this.to = new Date();
			return;
		}
		this.from = data.dateFrom ? new Date(data.dateFrom) : new Date(this.defaultData.dateFrom);
		this.to = data.dateTo ? new Date(data.dateTo) : new Date(this.defaultData.dateTo);
	}

	resetRangeToDefault() {
		this.range = this.defaultData.dateRange;
	}

	reset() {
		this.range = this.defaultData.dateRange;
	}

	close() {
		this.open = false;
	}

	changeRangeType() {
		if(this.range === DateRangeType.CUSTOM) {
			this.open = true;
			return;
		}

		this.valuesChanged.emit({
			'dateRange': this.range,
			'dateFrom': DateRangeType.getDateRangeData(this.range).dateFrom,
			'dateTo': DateRangeType.getDateRangeData(this.range).dateTo
		});
	}

	applyRange() {
		this.range = DateRangeType.CUSTOM;

		const from = this.from;
		const to = this.to;

		this.valuesChanged.emit({
			'dateRange': this.range,
			'dateFrom': DateRangeType.getUTCDate(from.setHours(0, 0, 0, 0)),
			'dateTo': DateRangeType.getUTCDate(to.setHours(23, 59, 59, 999))
		});
		this.close();
	}

	setFrom(date: Date) {
		if(!date) {
			return;
		}
		this.setLimits(date);

		this.from = date;

		if(this.to) {
			const to = this.calculateTo(this.from, <Date>this.to, this.max);
			this.setTo(to);
		}
	}

	setTo(date: Date) {
		if(!date) {
			return;
		}
		this.to = date;
	}

	private setLimits(date: Date) {
		this.min = date;
		this.max = new Date(date.getTime() + this.maxRange);
	}

	private calculateTo(from: Date, to: Date, max: Date) {
		const oneDay = 24*60*60*1000;
		const permissibleDownRange = -90;
		const diffDays = (from.getTime() - to.getTime()) / (oneDay);

		if(diffDays <= permissibleDownRange) {
			return max;
		}

		if(diffDays >= 0) {
			return from;
		}

		return to;
	}
}
