import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';

import { Subject } from 'rxjs';

import { NGXLineChartModel } from './chart.model';

interface INGXChartSeriesData {
	name: string;
	value: number;
}

interface INGXChartData {
	name: string;
	series: INGXChartSeriesData[];
}

@Component({
	selector: 'ngx-line-chart',
	templateUrl: './chart.html',
	styleUrls: ['./chart.scss']
})
export class NGXLineChartComponent implements OnInit, OnDestroy {
	@Input() data: INGXChartData[];
	@Input() viewData = new NGXLineChartModel();
	@Input() format = 'M/DD/YY';
	@Input() isXAxisTicks = false;
	@Input() dataSubj: Subject<INGXChartData[]>;

	xAxisTickFormattingFn = this.xAxisTickFormatting.bind(this);
	xAxisTicks: number[] = null;

	ngOnInit() {
		this.dataSubj
			.subscribe(resp => {
				this.data = resp;
				if(this.isXAxisTicks) {
					this.xAxisTicks = this.removeChartDuplicatesDates(resp);
				}
			});
	}

	ngOnDestroy() {
		if(this.dataSubj) {
			this.dataSubj.unsubscribe();
		}
	}

	onSelect(event) {}

	xAxisTickFormatting(value) {
		if(!this.data.length) {
			return;
		}
		return moment(value).utc().format(this.format);
	}

	private removeChartDuplicatesDates(arr: INGXChartData[]) {
		const results = [];
		arr
			.forEach(obj => {
				obj.series
					.filter(i => !~results.findIndex(y => y === i.name))
					.forEach(e => results.push(e.name));
			});

		return results.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
	}
}
