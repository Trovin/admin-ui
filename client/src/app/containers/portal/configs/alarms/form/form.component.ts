import {
	Component,
	Input,
	Output,
	OnInit,
	ViewChild,
	EventEmitter,
	OnDestroy
} from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { PermissionAction } from '@enums/permission-actions.enum';
import { Containers } from '@config/containers.enum';

import { DropdownItemPickerComponent } from '@components/ui/dropdown-item-picker/dropdown-item-picker.component';
import { DropdownItemPickerModel } from '@components/ui/dropdown-item-picker/dropdown-item-picker.model';

import { S3BucketDto } from '@rest/aws/s3/bucket-list/index';

import { AlarmStatuses } from '@enums/alarm-statuses.enum';
import { AlarmDataParamsService } from './../shared/params.service';

import { AlarmDataFormParamsModel } from './form-params.model';
import { AlarmConfigDto } from '@rest/alarm-config';

type AlarmStatusesModel = {
	name: string;
	value: AlarmStatuses;
	checked: boolean;
};

@Component({
	selector: 'alarm-data-form',
	templateUrl: './form.html',
	styleUrls: ['./form.scss']

})

export class AlarmConfigFormComponent implements OnInit, OnDestroy {
	@ViewChild('bucketList', {static: true}) bucketList: DropdownItemPickerComponent;
	@ViewChild('statusesList', {static: true}) statusesList: DropdownItemPickerComponent;

	@Output() changed = new EventEmitter<AlarmDataFormParamsModel>();
	@Output() create = new EventEmitter();
	@Output() deleteSelected = new EventEmitter();

	@Input() loading = false;
	@Input() buckets = new Subject<DropdownItemPickerModel[]>();
	@Input() selectedConfigs: AlarmConfigDto[];

	private sub = new Subscription();

	bucketListSubj = new Subject<DropdownItemPickerModel[]>();

	permission = PermissionAction;
	containers = Containers;

	params = new AlarmDataFormParamsModel();

	alarmStatuses: AlarmStatusesModel[] = [
		{name: AlarmStatuses.OK, value: AlarmStatuses.OK, checked: false},
		{name: AlarmStatuses.ALARM, value: AlarmStatuses.ALARM, checked: false},
		{name: AlarmStatuses.INACTIVE, value: AlarmStatuses.INACTIVE, checked: false}
	];

	open = false;

	constructor(
		private paramsService: AlarmDataParamsService,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		const sub = this.route.paramMap
			.subscribe(() => {
				this.selectedConfigs = [];
				this.configParams();
				this.initBucketList();
			});

		this.sub.add(sub);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	close() {
		this.open = false;
	}

	submit() {
		this.changed.emit(this.params);
	}

	reset() {
		this.resetData();
		this.submit();
	}

	addConfig() {
		this.create.emit();
	}

	refresh() {
		this.changed.emit(this.params);
	}

	deleteSelectedConfigs() {
		this.deleteSelected.emit(this.selectedConfigs);
	}

	changeBucket(val: DropdownItemPickerModel) {
		if(!val.value) {
			this.changeBucketParam(null);
			return;
		}

		this.changeBucketParam(val.name);
	}

	changeStatusesParam(val: string) {
		this.params.status = AlarmStatuses[val];
	}

	changeSourcePrefix(val: string) {
		this.params.sourcePrefix = val || null;
	}

	private changeBucketParam(val: string) {
		this.params.bucket = val;
	}

	private resetData() {
		this.changeBucketParam(null);
		this.changeStatusesParam(null);
		this.params.sourcePrefix = null;
		this.params.enabledOnly = false;
		this.bucketList.reset();
		this.statusesList.reset();
	}

	private configParams() {
		const params = this.paramsService.getParams();
		this.params = params;
		this.alarmStatuses.forEach((e) => e.checked = e.value === params.status);
	}

	private initBucketList() {
		this.configBucketListStatuses(true, true);

		const sub = this.buckets.subscribe(
				resp => {
					this.composeBucketListData(resp);
					this.configBucketListStatuses(false, false);
				},
				() => this.configBucketListStatuses(false, true)
			);

		this.sub.add(sub);
	}

	private composeBucketListData(resp: S3BucketDto[]) {
		const bucketList = resp.map(e => {
			return {
				name: e.name,
				value: {name: e.name},
				checked: e.name === this.params.bucket
			};
		});

		this.bucketListSubj.next(bucketList);
	}

	private configBucketListStatuses(loading: boolean, disabled: boolean) {
		this.bucketList.loading = loading;
		this.bucketList.disabled = disabled;
	}
}
