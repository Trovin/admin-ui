import {
	Component,
	OnInit,
	ViewChild,
	OnDestroy,
	HostListener
} from '@angular/core';
import ExpressionDescriptor from 'cronstrue';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { DropdownItemPickerComponent } from '@components/ui/dropdown-item-picker/dropdown-item-picker.component';
import { DropdownItemPickerModel } from '@components/ui/dropdown-item-picker/dropdown-item-picker.model';

import { S3BucketDto } from '@rest/aws/s3/bucket-list/index';

import {
	AlarmConfigDto,
	AlarmConfigService,
	AlarmConfigQueriesDto,
	AlarmConfigUpdateQueriesDto
} from '@rest/alarm-config/index';

@Component({
	selector: 'action-modal',
	templateUrl: './action-modal.html',
	providers: [AlarmConfigService]
})

export class ActionModalComponent implements OnInit, OnDestroy {
	@ViewChild('bucketList', {static: true}) bucketList: DropdownItemPickerComponent;
	@HostListener('document:mousedown', ['$event'])
	onDocumentMouseDown(event) {
		if(event.target.nodeName === 'MODAL-CONTAINER') {
			this.bsModalRef.hide();
		}
	}

	private sub = new Subscription();

	actionForm: FormGroup;
	bucketListData: S3BucketDto[] = [];
	bucketListDropdown: DropdownItemPickerModel[] = [];
	textControlBtn: string;
	title: string;

	isEditMode = false;
	isCopyMode = false;
	submitted = false;

	isShowCopyInvalidMsg: boolean;
	isCheckingConfig: boolean;
	isOverwriteConfig: boolean;
	isBucketValid: boolean;
	isCollapsedInfo: boolean;

	createConfigSubj = new Subject<AlarmConfigDto>();
	updateConfigSubj = new Subject<AlarmConfigUpdateQueriesDto>();
	configsListSubj = new Subject<AlarmConfigDto[]>();

	config = new AlarmConfigDto();
	overwritedConfig = new AlarmConfigDto();
	currentConfig: AlarmConfigDto;

	constructor(
		public bsModalRef: BsModalRef,
		private formBuilder: FormBuilder,
		private configService: AlarmConfigService
	) {}

	ngOnInit() {
		this.setDefaultState();
		this.createForm();
		this.composeBucketListData();
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	submit() {
		this.submitted = true;

		if(!this.currentConfig.bucket) {
			this.isBucketValid = false;
		}

		if(this.checkCopyInvalid(this.currentConfig.bucket, this.actionForm.value.sourcePrefix)) {
			this.isShowCopyInvalidMsg = true;
			return;
		}

		if(this.actionForm.invalid || !this.currentConfig.bucket || this.isCheckingConfig) {
			return;
		}

		const config = Object.assign(this.currentConfig, this.actionForm.value);
		this.isEditMode ? this.getUpdateConfig(config) : this.setCreateConfig(config);
		this.bsModalRef.hide();
	}

	setCreateConfig(config: AlarmConfigDto) {
		config.active = true;
		this.createConfigSubj.next(config);
	}

	getUpdateConfig(config: AlarmConfigDto) {
		const updatedConfig = new AlarmConfigUpdateQueriesDto();
		updatedConfig.changedBucket = this.config.bucket;
		updatedConfig.changedSourcePrefix = this.config.sourcePrefix;

		const queries = Object.assign(config, updatedConfig);
		this.updateConfigSubj.next(queries);
	}

	cancel() {
		this.bsModalRef.hide();
	}

	get form() {
		return this.actionForm.controls;
	}

	private createForm() {
		this.actionForm = this.formBuilder.group({
			cronExpression: [this.currentConfig.cronExpression, Validators.required],
			durationHours: [this.currentConfig.durationHours, Validators.required],
			sourcePrefix: [this.currentConfig.sourcePrefix, Validators.required],
			customSnsTopicArn: [this.currentConfig.customSnsTopicArn, Validators.pattern('arn:aws:sns:.*:.*:.*')],
			confirmOverwriteConfig: [false, Validators.requiredTrue]
		});

		this.actionForm.controls.confirmOverwriteConfig.disable();

		const cronExpressionSub = this.actionForm
			.get('cronExpression')
			.valueChanges
			.subscribe(val => {
				this.currentConfig.cronDescription = this.getCronDescription(val);
			});

		this.sub.add(cronExpressionSub);

		const sourcePrefixSub = this.actionForm
			.get('sourcePrefix')
			.valueChanges
			.subscribe(val => {
				if(!this.checkCopyInvalid(this.currentConfig.bucket, val)) {
					this.isShowCopyInvalidMsg = false;
				}

				this.checkExistConfig(this.currentConfig.bucket, val);
			});

		this.sub.add(sourcePrefixSub);
	}

	changeBucket(bucketVal: string) {
		if(!bucketVal) {
			return;
		}

		this.isBucketValid = true;
		this.changeBucketParam(bucketVal);
		this.checkExistConfig(bucketVal, this.actionForm.value.sourcePrefix);

		if(!this.checkCopyInvalid(bucketVal, this.actionForm.value.sourcePrefix)) {
			this.isShowCopyInvalidMsg = false;
		}
	}

	private checkExistConfig(bucket: string, sourcePrefix: string) {
		const hasSameValues = this.checkSomeValues(bucket, sourcePrefix);

		if(!bucket || !sourcePrefix || hasSameValues) {
			return;
		}

		this.isCheckingConfig = true;
		const checkQuery = new AlarmConfigQueriesDto({
			sourcePrefix: sourcePrefix,
			bucket: bucket
		});

		this.configService
			.getList(checkQuery)
			.subscribe(res => {
				this.isCheckingConfig = false;
				const list = res.content.filter(item => item.sourcePrefix === checkQuery.sourcePrefix && item.bucket === checkQuery.bucket);

				if(!list.length) {
					this.isOverwriteConfig = false;
					this.overwritedConfig = new AlarmConfigDto();
					this.actionForm.controls.confirmOverwriteConfig.disable();
					return;
				}

				this.isOverwriteConfig = true;
				this.overwritedConfig = list[0];
				this.actionForm.controls.confirmOverwriteConfig.enable();
			});
	}

	private checkCopyInvalid(bucket: string, sourcePrefix: string): boolean {
		const isSameValues = this.checkSomeValues(bucket, sourcePrefix);
		return this.isCopyMode && isSameValues;
	}

	private checkSomeValues(bucket: string, sourcePrefix: string): boolean {
		return bucket === this.config.bucket && sourcePrefix === this.config.sourcePrefix;
	}

	private getCronDescription(cronExpression: string) {
		return ExpressionDescriptor.toString(cronExpression, { throwExceptionOnParseError: false, use24HourTimeFormat: true });
	}

	private changeBucketParam(val: string) {
		this.currentConfig.bucket = val;
	}

	private setDefaultState() {
		this.currentConfig = new AlarmConfigDto(this.config);
		this.isCheckingConfig = false;
		this.isBucketValid = true;
		this.isOverwriteConfig = false;
		this.isCollapsedInfo = false;
	}

	private composeBucketListData() {
		const bucketList = this.bucketListData.map(e => {
			return {
				name: e.name,
				value: {name: e.name},
				checked: e.name === this.currentConfig.bucket
			};
		});

		this.bucketListDropdown = bucketList;
	}
}
