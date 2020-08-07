import { AfterViewInit, Component, ElementRef, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Subject } from 'rxjs';

import * as moment from 'moment';

import { Chart, PositionType } from 'chart.js';

import { ChartDto } from '@rest/chart/chart.dto';

import { DataModel } from './data.model';
import { DataSetModel } from './data-set.model';


@Component({
	selector: 'chart',
	templateUrl: './chart.html',
	styleUrls: ['./chart.scss']
})
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('chartArea') chart: ElementRef;
	@ViewChild('legend') legend: ElementRef;

	@Input() dataSubj: Subject<ChartDto>;
	@Input() type = 'line';
	@Input() xAxesType = 'time';
	@Input() timezone = 'UTC';
	@Input() format = 'M/D/YY, h:mm';
	@Input() yAxesLabelString = '';
	@Input() yAxestype = 'linear';
	@Input() legendPosition: PositionType = 'bottom';
	@Input() animationDuration = 2000;
	@Input() fill: boolean|string = false;

	private chartInst: Chart;
	private data = new DataModel();
	private colorScheme = [
		'#647c8a',
		'#ff3d00',
		'#7aa3e5',
		'#ff9800',
		'#00b862',
		'#32118d',
		'#2196f3',
		'#afdf0a',
		'#a8385d',
		'#a7b61a',
		'#ad6886',
		'#50abcc',
		'#ffca28',
		'#b455be',
		'#800000',
		'#008080',
		'#800080',
		'#a7e571',
		'#5ac18e',
		'#b96fe7',
		'#e7856f',
		'#efd867',
		'#b667ef',
		'#71afe5',
		'#2e353e',
		'#e571d3',
		'#e571d3',
		'#6190f5',
		'#f5a161',
		'#8161f5',
		'#000000'
	];

	private selectedDataset = [];

	ngOnInit() {
		this.dataSubj
			.subscribe(resp => {
				this.composeDataSet(resp);
				this.updateData();
			});
	}

	ngAfterViewInit() {
		this.updateData();
	}

	ngOnDestroy() {
		if(this.chartInst) {
			this.chartInst.destroy();
		}
	}

	private updateData() {
		if(this.chartInst) {
			this.chartInst.destroy();
		}

		this.createChartInst();
		this.composeCustomLegends();
	}

	private createChartInst() {
		this.chartInst = new Chart(this.chart.nativeElement, {
			type: this.type,
			data: {
				datasets: this.data.datasets
			},
			options: {
				legend: {
					display: false,
					position: this.legendPosition,
					labels: {
						boxWidth: 20
					}
					// @TODO: For future feature: add 'All' button
					// onClick: function (e, legendItem) {
					// 	if(legendItem.text === 'All') {
					// 		this.chart.config.data.datasets
					// 			.forEach(el => el.hidden = !el.hidden);
					// 	} else {
					// 		this.chart.config.data.datasets
					// 			.filter((el, i) => i === legendItem.datasetIndex)
					// 			.forEach(el => el.hidden = !el.hidden);
					// 	}
					// 	this.chart.update();
					// }
				},
				elements: {
					point: {
						radius: 2
					},
					line: {
						tension: 0 // disables bezier curves
					}
				},
				responsive: true,
				maintainAspectRatio: true,
				hover: {
					mode: 'point',
					intersect: false
				},
				animation: {
					duration: this.animationDuration
				},
				scales: {
					yAxes: [
						{
							type: this.yAxestype,
							ticks: {
								beginAtZero: true,
								callback: value => value.toLocaleString('en-US')
								// float ticks values will not be displayed in order to prevent incomplete view of ticks values
								// callback: (value: number, index: number, values: number[]) => (value % 1 > 0) ? null : value
							},
							scaleLabel: {
								display: true,
								labelString: this.yAxesLabelString
							}
						}
					],
					xAxes: [{
						type: this.xAxesType,
						display: true,
						offset: true,
						// gridLines: {
						// 	offsetGridLines: true
						// },
						ticks: {
							source: 'data',
							autoSkip: false,
							callback: (value, index, values) => {
								if(this.xAxesType !== 'time') {
									return;
								}
								if(!values[index]) {
									return;
								}
								return this.getDate(values[index]['value']);
							}
						}
					}]
				}
			}
		});
	}

	private getDate(value: number|string) {
		return this.timezone === 'UTC' ? moment(value).utc().format(this.format) : moment(value).format(this.format);
	}

	private composeCustomLegends() {
		if(!this.data.datasets.length) {
			return;
		}
		this.legend.nativeElement.innerHTML = null;
		this.legend.nativeElement.innerHTML = this.chartInst.generateLegend();
		const items = this.legend.nativeElement.getElementsByTagName('li');

		for(const item of items) {
			item.addEventListener('click', this.clickCustomLegend.bind(this));
			this.hideDatset(item);
		}
	}

	private clickCustomLegend(e) {
		const event = e || window.event;
		const target = event.target || event.srcElement;
		const targetEl = target.tagName === 'SPAN' ? target.parentElement : target; // Quick fix for click on color cube
		const parent = targetEl.parentElement;
		const chart = this.chartInst['chart'];
		const index = [].slice.call(parent.children).indexOf(targetEl);
		const dataset = chart.legend.legendItems[index];

		chart.legend.options.onClick.call(chart, event, dataset);
		chart.isDatasetVisible(dataset.datasetIndex) ? targetEl.classList.remove('hidden') : targetEl.classList.add('hidden');
		this.composeStoredDataset(dataset);
	}

	private hideDatset(htmlEl) {
		if(!this.selectedDataset.length || !this.selectedDataset.some(e => e.text === htmlEl.textContent)) {
			return;
		}
		const chart = this.chartInst['chart'];
		chart.config.data.datasets
			.filter(e => e.label === htmlEl.textContent)
			.forEach(e => e.hidden = true);
		htmlEl.classList.add('hidden');
		chart.update();
	}

	private composeStoredDataset(dataset) {
		const chart = this.chartInst['chart'];
		if(chart.isDatasetVisible(dataset.datasetIndex)) {
			this.selectedDataset = this.selectedDataset.filter((e) => e.text !== dataset.text);
		} else {
			this.selectedDataset.push(dataset);
		}
	}

	private composeDataSet(resp: ChartDto) {
		if(!resp.datasets) {
			return;
		}
		// @TODO: For future feature: add 'All' button
		// this.data = new DataModel({
		// 	datasets: [new DataSetModel({
		// 		data: [],
		// 		label: 'All',
		// 		backgroundColor: '#000'
		// 	})],
		// 	xAxis: resp.xAxis
		// });
		this.data = new DataModel();
		resp.datasets.forEach((item, index) => {
			const data = new DataSetModel(item);
			data.backgroundColor = this.colorScheme[index];
			data.borderColor = this.colorScheme[index];
			data.lineTension = 0;
			data.borderWidth = 1;
			data.fill = this.fill;
			this.data.datasets.push(data);
		});
	}
}
