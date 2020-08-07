import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DateRangeType } from '@enums/date-range-type.enum';

import {
	AlarmConfigQueriesDto,
	CloudWatchAlarmDto,
	CloudWatchAlarmService,
	AlarmConfigService,
	AlarmConfigDto
} from '@rest/alarm-config';
import { AlarmPipelineErrorsService, AlarmPipelineErrorDto } from '@rest/alarm-pipeline-errors';

import { AlarmPipelineErrorModel } from './alarm-pipeline-error.model';
import { AlarmWidgetItemModel } from './alarms-widget-item.model';

@Component({
	selector: 'alarms-widget',
	templateUrl: './alarms-widget.html',
	styleUrls: ['./alarms-widget.scss'],
	providers: [
		AlarmConfigService,
		CloudWatchAlarmService,
		AlarmPipelineErrorsService
	]
})

export class AlarmsWidgetComponent implements OnInit {

	alarmLambdaItems: AlarmWidgetItemModel[] = [];
	cloudWatchAlarmItems: CloudWatchAlarmDto[] = [];
	alarmPipelineErrorsItems: AlarmPipelineErrorModel[] = [];

	loading = false;

	constructor(
		private service: AlarmConfigService,
		private cloudWatchService: CloudWatchAlarmService,
		private alarmPipelineErrorsService: AlarmPipelineErrorsService
	) {}

	ngOnInit() {
		this.fetch();
	}

	fetch() {
		this.loading = true;

		forkJoin(
			this.alarmLambdaItemsObservable(),
			this.cloudWatchAlarmsObservable(),
			this.pipelineErrorsAlarmsObservable()
		)
		.subscribe(
			([alarmLambdaItems, cloudWatchItems, pipelineErrorsItems]) => {
				this.loading = false;

				this.composeAlarmLambdaItemsList(alarmLambdaItems.content);
				this.cloudWatchAlarmItems = cloudWatchItems;
				this.alarmPipelineErrorsItems = pipelineErrorsItems;
			},
			() => {
				this.alarmLambdaItems = [];
				this.cloudWatchAlarmItems = [];
				this.alarmPipelineErrorsItems = [];
				this.loading = false;
			}
		);
	}

	private alarmLambdaItemsObservable() {
		const queries = new AlarmConfigQueriesDto();
		queries.itemsPerPage = 100;

		return this.service.getList(queries);
	}

	private cloudWatchAlarmsObservable() {
		return this.cloudWatchService.getList();
	}

	private pipelineErrorsAlarmsObservable(): Observable<AlarmPipelineErrorModel[]> {
		return this.alarmPipelineErrorsService.getList()
			.pipe(
				map((data: AlarmPipelineErrorDto[]) => {
					return data.map(e => {
						return new AlarmPipelineErrorModel({
							...e,
							errorDetailsLink: `/portal/monitoring/pipelines/${e.pipeline}/${e.sourceApplication}/${e.component}/errors-details`,
							errorDetailsParams: {
								sourceApplication: e.sourceApplication,
								dateRange: DateRangeType.CUSTOM,
								dateFrom: DateRangeType.getSubtractDate(e.lastCheckDate, 2, 'weeks'),
								dateTo: DateRangeType.getDate(e.lastCheckDate),
								withErrorsOnly: true
							}
						});
					});
				})
			);
	}

	private composeAlarmLambdaItemsList(items: AlarmConfigDto[]) {
		const alarms = items
			.filter(item => item.currentStatus === 'ALARM' && item.active)
			.map(item => {
				const listItem = new AlarmWidgetItemModel(item);

				listItem.queryParams = {
					'bucket': listItem.bucket,
					'sourcePrefix': listItem.sourcePrefix
				};

				return listItem;
			});

		this.alarmLambdaItems = alarms;
	}
}
