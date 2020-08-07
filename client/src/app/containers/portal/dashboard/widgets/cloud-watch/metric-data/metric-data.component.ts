import { Component, ViewChild, OnInit } from '@angular/core';

import { Subscription, Subject } from 'rxjs';

import * as moment from 'moment';

import { DateRangeDataModel } from '@components/ui/date-range/date-range.model';

import { PermissionAction } from '@enums/permission-actions.enum';
import { DateRangeType } from '@enums/date-range-type.enum';
import { Containers } from '@config/containers.enum';

import { ChartDto, ChartDataSetDto, ChartDataDto } from '@rest/chart';
import { CloudWatchMetricsQueriesDto } from '@rest/aws/cloud-watch/cloud-watch-metrics.queries.dto';
import { GetMetricDataOutput, CloudWatchMetricDataService } from '@rest/aws/cloud-watch/metric-data';

import { CloudWatchWidgetFormComponent } from './../shared/form/form.component';

@Component({
	selector: 'cloud-watch-widgets-metric-data',
	templateUrl: './metric-data.html',
	providers: [
		CloudWatchMetricDataService
	]
})

export class CloudWatchMetricDataWidgetComponent implements OnInit {
	@ViewChild(CloudWatchWidgetFormComponent, {static: true}) form: CloudWatchWidgetFormComponent;

	private cloudWatchMetricDataSub: Subscription;
	private kinesisPutRecordsData: DateRangeDataModel;

	chartDataSubj = new Subject<ChartDto>();
	chartDateFormat = '';
	yAxesLabelString = 'Events Count';
	kinesisPutRecordsLoading = false;

	permission = PermissionAction;
	containers = Containers;

	constructor(private cloudWatchMetricDataService: CloudWatchMetricDataService) {}

	ngOnInit() {
		this.setkinesisPutRecordsData(this.form.data);
		this.initKinesisPutRecordsMetricsData();
	}

	ngOnDestroy() {
		this.cloudWatchMetricDataSub.unsubscribe();
	}

	performSearch(data: DateRangeDataModel) {
		this.setkinesisPutRecordsData(data);
		this.initKinesisPutRecordsMetricsData();
	}

	private setkinesisPutRecordsData(data: DateRangeDataModel) {
		this.kinesisPutRecordsData = data;
		this.chartDateFormat = data.format;
	}

	private initKinesisPutRecordsMetricsData() {
		const params = new CloudWatchMetricsQueriesDto({
			namespace: 'AWS/Kinesis',
			metricName: 'PutRecords.Records',
			statistics: 'Sum',
			scanBy: 'TimestampAscending',
			startTime: this.kinesisPutRecordsData.dateFrom,
			endTime: this.kinesisPutRecordsData.dateTo,
			period: this.kinesisPutRecordsData.period
		});

		this.kinesisPutRecordsLoading = true;
		this.cloudWatchMetricDataSub = this.cloudWatchMetricDataService
			.getList(params)
			.subscribe(
				(resp: GetMetricDataOutput) => {
					this.kinesisPutRecordsLoading = false;
					const data = this.composeChartCloudWatchMetricData(resp);
					this.chartDataSubj.next(data);
				},
				() => this.kinesisPutRecordsLoading = false
			);
	}

	private composeChartCloudWatchMetricData(data: GetMetricDataOutput) {
		let chartData = new ChartDto({
			datasets: this.composeChartCloudWatchMetricDatasets(data)
		});

		if(this.kinesisPutRecordsData.dateRange === DateRangeType.LAST_12MONTHS) {
			chartData = this.compose12MonthData(chartData);
		}

		return chartData;
	}

	private compose12MonthData(data: ChartDto) {
		let currentValDate: Date;
		let currentValMonth: number;

		data.datasets.forEach((el: ChartDataSetDto) => {
			const dataMap = new Map<number, ChartDataDto>();

			el.data
				.sort((a, b) => a.x - b.x)
				.forEach(current => {
					currentValDate = new Date(current.x);
					currentValMonth = new Date(currentValDate.getFullYear(), currentValDate.getMonth() + 1, 0).getTime();
					const item = dataMap.get(currentValMonth);
					if(!item) {
						dataMap.set(currentValMonth, {
							x: currentValMonth,
							y: current.y
						});
					} else {
						item.y += current.y;
					}
					return current;
			}, new ChartDataDto);

			el.data = Array.from(dataMap.values());
		});

		return data;
	}

	private composeChartCloudWatchMetricDatasets(data: GetMetricDataOutput): ChartDataSetDto[] {
		return data.MetricDataResults
			.map(i => {
				const d = new ChartDataSetDto({
					label: i.Label,
					data: i.Timestamps.map((el, index) => {
						return new ChartDataDto({
							x: moment(el).utc().valueOf(),
							y: i.Values[index]
						});
					})
				});

				return d;
			});
	}
}
