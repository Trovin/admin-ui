import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { forkJoin, of } from 'rxjs';
import { map, exhaustMap } from 'rxjs/operators';

import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
import { DateRangeDataModel } from '@components/ui/date-range/date-range.model';

import { Containers } from '@config/containers.enum';

import { CloudWatchWidgetImageService } from '@rest/aws/cloud-watch/widget-image';
import { WidgetImageQueriesDto } from '@rest/aws/cloud-watch/widget-image/widget-image.queries.dto';

import { CloudWatchPersistentStateService, CloudWatchPersistentStateParams } from './../shared/persistent-state.service';
import { CloudWatchWidgetImageModel } from './widget-image.model';
import { ModalsService } from './modal/modals.service';

const CONTAINER = `galaxy-${Containers.DASHBOARD}`;

@Component({
	selector: 'cloud-watch-widgets-image',
	templateUrl: './widget-image.html',
	providers: [
		ModalsService,
		CloudWatchWidgetImageService
	]
})

export class CloudWatchWidgetImageComponent implements OnInit {
	private params: CloudWatchPersistentStateParams;

	widgets: CloudWatchWidgetImageModel[] = [];
	loading = false;

	constructor(
		private _sanitizer: DomSanitizer,
		private modalService: ModalsService,
		private cloudWatchPersistentStateService: CloudWatchPersistentStateService,
		private cloudWatchWidgetImageService: CloudWatchWidgetImageService
	) {}

	ngOnInit() {
		this.params = this.cloudWatchPersistentStateService.getParams(CONTAINER);
		this.initWidgets();
	}

	setDate(data: DateRangeDataModel, widget: CloudWatchWidgetImageModel) {
		widget.dateFrom = data.dateFrom;
		widget.dateTo = data.dateTo;
		widget.period = data.period;
		widget.loading = true;

		this.cloudWatchPersistentStateService.setParamsSubj(CONTAINER, {
			[widget.uuid]: {
				dateRange: data.dateRange,
				dateFrom: widget.dateFrom,
				dateTo: widget.dateTo,
				period: widget.period
			}
		});

		widget.loading = true;
		this.getWidgetImage(widget)
			.subscribe(
				(resp) => {
					widget.loading = false;
					this.widgets = this.widgets.map(e => resp.uuid === e.uuid ? resp : e);
				},
				() => widget.loading = false
			);
	}

	openCreteWidgetModal() {
		this.modalService.open( {
			title: 'Create Widget',
			action: ModalActionsEnum.CREATE
		})
		.subscribe((status) => {
			if(status) {
				this.widgets.splice(0);
				this.initWidgets();
			}
		});
	}

	opeEditWidgetModal(widget: CloudWatchWidgetImageModel) {
		this.modalService.open( {
			item: widget,
			title: 'Edit Widget',
			action: ModalActionsEnum.UPDATE
		})
		.subscribe((status) => {
			if(status) {
				widget.loading = true;
				this.widgets.splice(0);
				this.initWidgets();
			}
		});
	}

	deleteWidget(widget: CloudWatchWidgetImageModel) {
		this.modalService.open( {
			item: widget,
			title: 'Delete Widget',
			action: ModalActionsEnum.DELETE
		})
		.subscribe((status) => {
			if(status) {
				this.widgets = this.widgets.filter(e => e.uuid !== widget.uuid);
			}
		});
	}

	initWidgets() {
		this.loading = true;
		this.cloudWatchWidgetImageService
			.getWidgets()
			.pipe(
				map(resp => {
					this.params = Object.assign(this.params, this.cloudWatchPersistentStateService.getParams(CONTAINER));
					return resp.map(item => {
						return this.getWidgetImage(new CloudWatchWidgetImageModel({
							...item,
							dateFrom: this.params[item.uuid] ? this.params[item.uuid].dateFrom : this.params.default.dateFrom,
							dateTo: this.params[item.uuid] ? this.params[item.uuid].dateTo : this.params.default.dateTo,
							period: this.params[item.uuid] ? this.params[item.uuid].period : this.params.default.period
						}));
					});
				}),
				exhaustMap(resp => resp.length ? forkJoin(...resp) : of([]))
			)
			.subscribe(
				(resp: CloudWatchWidgetImageModel[]) => {
					this.widgets = resp;
					this.loading = false;
				},
				() => this.loading = false
			);
	}

	private getWidgetImage(widget: CloudWatchWidgetImageModel) {
		const queries = new WidgetImageQueriesDto({
			widgetDefinition: widget.widgetDefinition,
			dateFrom: widget.dateFrom,
			dateTo: widget.dateTo,
			period: widget.period,
			updatedDate: widget.updatedDate,
			createdDate: widget.createdDate
		});

		const awsUri = 'https://us-west-2.console.aws.amazon.com/cloudwatch/home?region=us-west-2#metricsV2:graph=';

		return this.cloudWatchWidgetImageService
			.getWidgetImage(widget.uuid, queries)
			.pipe(
				map((e) => {
					return new CloudWatchWidgetImageModel({
						image: this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'+ e.image) as string,
						uuid: e.uuid,
						widgetDefinition: e.widgetDefinition,
						dateFrom: widget.dateFrom,
						dateTo: widget.dateTo,
						period: widget.period,
						err: e.err,
						href: e.widgetDefinition ? `${awsUri}${e.widgetDefinition.replace(/[%#\.]/gi, '')}` : awsUri,
						createdDate: e.createdDate,
						updatedDate: e.updatedDate
					});
				})
			);
	}
}
