import {
	Component,
	Input,
	Output,
	OnInit,
	ViewChild,
	EventEmitter,
	OnDestroy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, Subscription } from 'rxjs';

import { saveAs } from 'file-saver';

import { MaterialDateRangeComponent } from '@components/ui/date-range/material-date-range/material-date-range.component';
import { DropdownItemPickerComponent } from '@components/ui/dropdown-item-picker/dropdown-item-picker.component';
import { DropdownItemPickerModel } from '@components/ui/dropdown-item-picker/dropdown-item-picker.model';
import { DropdownItemMultiPickerComponent } from '@components/ui/dropdown-item-multi-picker/dropdown-item-multi-picker.component';
import { DropdownItemMultiPickerModel, DropdownItemMultiPickerValueModel } from '@components/ui/dropdown-item-multi-picker/dropdown-item-multi-picker.model';
import { DateRangeDataModel } from '@components/ui/date-range/date-range.model';

import { BatchDataEventIdsService, BatchDataEventIdDto, BatchDataEventIdsQueriesDto } from '@rest/batch-data/event-ids';
import { BatchDataSourceApplicationsService, BatchDataSourceApplicationDto } from '@rest/batch-data/source-applications';

import { GalaxyBucket } from '@enums/galaxy-bucket.enum';
import { DateRangeType } from '@enums/date-range-type.enum';
import { ReconFilter } from '@enums/recon-filter.enum';

import { BatchDataParamsService } from './../shared/params.service';
import { BatchDataBaseParamsModel } from './../shared/params-base.model';

import { BatchDataFormParamsModel } from './form-params.model';
import { BatchDataBucketFilesService, BatchDataBucketFilesQueriesDto } from '@rest/batch-data/bucket-files';


@Component({
	selector: 'batch-data-form',
	templateUrl: './form.html',
	styleUrls: ['./form.scss'],
	providers: [
		BatchDataEventIdsService,
		BatchDataBucketFilesService,
		BatchDataSourceApplicationsService
	]
})

export class BatchDataFormComponent implements OnInit, OnDestroy {
	@ViewChild('sourceApplications', {static: true}) sourceApplications: DropdownItemPickerComponent;
	@ViewChild('eventIds', {static: true}) eventIds: DropdownItemMultiPickerComponent;
	@ViewChild('reconFilter', {static: true}) reconFilter: DropdownItemPickerComponent;
	@ViewChild(MaterialDateRangeComponent) set data(dateRange: MaterialDateRangeComponent) {
		this.dateRange = dateRange;
	}

	@Output() changed = new EventEmitter<BatchDataFormParamsModel>();

	@Input() loading = false;

	private sub = new Subscription();
	private bucket = '';
	private dateRange: MaterialDateRangeComponent;

	sourceApplicationsSubj = new Subject<DropdownItemPickerModel[]>();
	eventIdsSubj = new Subject<DropdownItemMultiPickerModel[]>();

	params = new BatchDataFormParamsModel();
	dates = new DateRangeDataModel();
	defaultDates = DateRangeType.getDateRangeData(DateRangeType.ALL);

	excludeTimeFilterRange = [
		DateRangeType.LAST_3HOURS,
		DateRangeType.LAST_24HOURS,
		DateRangeType.LAST_12MONTHS
	];

	filterByOptions: DropdownItemPickerModel[] = [
		{name: 'All', value: ReconFilter.ALL, checked: true, highlighted: false},
		{name: 'Missing Only', value: ReconFilter.MISSING_ONLY, checked: false, highlighted: false},
		{name: 'Recon errors only', value: ReconFilter.RECON_ERRORS_ONLY, checked: false, highlighted: false}
	];

	timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	open = false;
	isOpenFilter = false;
	isFormInvalid = false;
	downloadLoading = false;

	constructor(
		private route: ActivatedRoute,
		private service: BatchDataBucketFilesService,
		private batchDataEventIdsService: BatchDataEventIdsService,
		private batchDataSourceApplicationsService: BatchDataSourceApplicationsService,
		private paramsService: BatchDataParamsService
	) {}

	ngOnInit() {
		const sub = this.route.paramMap
			.subscribe(params => {
				const previousBucket = this.bucket;
				const bucket = params.get('bucket');

				this.setPipelineAlias(bucket);

				if(previousBucket === bucket) {
					return;
				}

				this.configParams();
				this.initApplicationsList();
			});

		this.sub.add(sub);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
		this.sourceApplicationsSubj.complete();
	}

	close() {
		this.open = false;
	}

	submit() {
		if(!this.isOpenFilter) {
			this.resetFilters();
		}

		if(!this.params.sourceApplication || !this.params.eventIds) {
			this.isFormInvalid = true;
			return;
		}

		this.changed.emit(this.params);
	}

	downloadFile() {
		const resource = {
			...new BatchDataBucketFilesQueriesDto(this.params),
			itemsPerPage: 10000
		};

		this.downloadLoading = true;

		this.service
			.download(this.bucket, resource)
			.subscribe(
				resp => {
					this.downloadLoading = false;
					const blob = new Blob([resp.body], { type: 'text/csv' });
					saveAs(blob, 'download.csv');
				},
				() => this.downloadLoading = false
			);
	}

	reset() {
		this.resetDateRange();
		this.resetSources();
		this.resetEventIds();
		this.resetFilters();
		this.resetReconFilter();

		this.changed.emit(this.params);
	}

	resetFilters() {
		this.isOpenFilter = false;

		this.params.objectKey = null;
		this.params.dateFrom = null;
		this.params.dateTo = null;
		this.params.dateRange = null;
	}

	changeSource(sourceVal: string) {
		if(!sourceVal) {
			this.isFormInvalid = true;
			this.resetSources();
			this.resetEventIds();
			return;
		}

		this.isFormInvalid = false;
		this.changeSourceParam(sourceVal);
		this.initEventIdList(sourceVal);
	}

	changeEventId(eventIds: DropdownItemMultiPickerModel[]) {
		const list = eventIds.map(event => event.name) || null;

		if(!list) {
			this.isFormInvalid = true;
			this.changeEventIdsParam(null);
			return;
		}

		this.isFormInvalid = false;
		this.changeEventIdsParam(list);
	}

	applyDates(dates: DateRangeDataModel) {
		this.params.dateRange = dates.dateRange;
		this.params.dateFrom = dates.dateFrom;
		this.params.dateTo = dates.dateTo;
	}

	toggleFilter() {
		this.isOpenFilter = !this.isOpenFilter;
	}

	changedFilterByOption(value: string) {
		this.params.reconFilter = ReconFilter[value];
	}

	private setPipelineAlias(name: string) {
		const pipline = GalaxyBucket.getByAlias(name);
		this.bucket = GalaxyBucket.getValues(pipline).alias;
	}

	private changeEventIdsParam(values: string[]) {
		this.params.eventIds = values;
	}

	private changeSourceParam(val: string) {
		this.params.sourceApplication = val;
	}

	private configParams() {
		const params = new BatchDataBaseParamsModel(this.paramsService.getParams());
		const dates = DateRangeType.getDateRangeData(params.dateRange);

		this.dates = new DateRangeDataModel({
			dateRange: params.dateRange || DateRangeType.ALL,
			dateFrom: dates.dateFrom || params.dateFrom,
			dateTo: dates.dateTo || params.dateTo
		});

		this.isOpenFilter = !!params.objectKey || !!(params.dateTo && params.dateFrom);

		this.filterByOptions = this.filterByOptions.map((e) => {
			e.checked = e.value === params.reconFilter;
			return e;
		});

		this.params = new BatchDataFormParamsModel(params);
	}

	private initApplicationsList() {
		this.configSourceApplicationsStatuses(true, true);
		const sub = this.batchDataSourceApplicationsService
			.getList(this.bucket)
			.subscribe(
				resp => {
					this.composeSourceApplicationsData(resp);
					const checkedSourceApplication = this.sourceApplications.values.filter(e => e.checked && e.value)[0];
					const val = checkedSourceApplication ? <string>checkedSourceApplication.value : null;
					this.initEventIdList(val);
					this.configSourceApplicationsStatuses(false, false);
				},
				() => this.configSourceApplicationsStatuses(false, true)
			);

		this.sub.add(sub);
	}

	private initEventIdList(sourceVal: string) {
		if(!sourceVal) {
			this.resetEventIds();
			return;
		}

		this.configeventIdsStatuses(true, true);

		const queries = new BatchDataEventIdsQueriesDto({
			sourceApplication: sourceVal
		});

		const sub = this.batchDataEventIdsService
			.getList(this.bucket, queries)
			.subscribe(
				resp => {
					this.composeEventIdsData(resp);
					this.configeventIdsStatuses(false, false);
				},
				() => this.configeventIdsStatuses(false, true)
			);
		this.sub.add(sub);
	}

	private composeSourceApplicationsData(resp: BatchDataSourceApplicationDto) {
		const sourceApplications = resp.sourceApplications.map(e => {
			return {
				name: e,
				value: e,
				checked: e === this.params.sourceApplication
			};
		});

		const hasSelectedSourceApplications = sourceApplications.some(item => item.checked);
		this.handleNoSelectedSource(hasSelectedSourceApplications);

		this.sourceApplicationsSubj.next(sourceApplications);
	}

	private composeEventIdsData(resp: BatchDataEventIdDto) {
		const eventIdsList = this.getEventIdList();

		const eventIds = resp.eventIds.map(event => {
			const dropdownItem = new DropdownItemMultiPickerModel({
				name: event,
				value: { name: event },
				checked: eventIdsList.includes(event)
			});

			return dropdownItem;
		});

		const hasSelectedEventId = eventIds.some(item => item.checked);
		this.handleNoSelectedEventId(hasSelectedEventId);

		this.eventIdsSubj.next(eventIds);
	}

	private getEventIdList(): string[] {
		if(!this.params.eventIds) {
			return [];
		}
		return typeof this.params.eventIds === 'string' ? [this.params.eventIds] : this.params.eventIds;
	}

	private handleNoSelectedEventId(hasSelected: boolean) {
		if(!hasSelected) {
			this.changeEventIdsParam(null);
		}
	}

	private handleNoSelectedSource(hasSelected: boolean) {
		if(!hasSelected) {
			this.changeSourceParam(null);
		}
	}

	private resetEventIds() {
		this.changeEventIdsParam(null);
		this.eventIdsSubj.next([]);
	}

	private resetSources() {
		this.changeSourceParam(null);
		this.sourceApplications.reset();
	}

	private resetDateRange() {
		if(this.isOpenFilter) {
			this.dateRange.reset();
		}
	}

	private resetReconFilter() {
		this.changedFilterByOption(ReconFilter.ALL);
		this.reconFilter.reset();
	}

	private configSourceApplicationsStatuses(loading: boolean, disabled: boolean) {
		this.sourceApplications.loading = loading;
		this.sourceApplications.disabled = disabled;
	}

	private configeventIdsStatuses(loading: boolean, disabled: boolean) {
		this.eventIds.loading = loading;
		this.eventIds.disabled = disabled;
	}
}
