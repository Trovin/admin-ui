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

import { DropdownItemPickerComponent } from '@components/ui/dropdown-item-picker/dropdown-item-picker.component';
import { DropdownItemPickerModel } from '@components/ui/dropdown-item-picker/dropdown-item-picker.model';

import { S3UploaderConfigDto, S3UploaderConfigService, S3UploaderPathConfigDto } from '@rest/aws/s3/uploader/config';

import { S3UploaderRouterStateParamsModel } from './../shared/router-state-params.model';
import { FormParamsModel } from './form-params.model';

@Component({
	selector: 'data-form',
	templateUrl: './form.html',
	styleUrls: ['./form.scss'],
	providers: [
		S3UploaderConfigService
	]
})

export class FormComponent implements OnInit, OnDestroy {
	@ViewChild('bucketList', {static: true}) bucketList: DropdownItemPickerComponent;
	@ViewChild('pathList', {static: true}) pathList: DropdownItemPickerComponent;

	// @TODO: mutable object. Would be great to use service
	@Input() stateParams: S3UploaderRouterStateParamsModel = new S3UploaderRouterStateParamsModel();
	@Output() changed = new EventEmitter<FormParamsModel>();

	params: FormParamsModel = new FormParamsModel();
	bucketListSubj = new Subject<DropdownItemPickerModel[]>();
	pathListSubj = new Subject<DropdownItemPickerModel[]>();
	isFormInvalid = false;

	private configs: S3UploaderConfigDto[];
	private sub = new Subscription();

	constructor(
		private configService: S3UploaderConfigService
	) {}

	ngOnInit() {
		this.params.bucket = this.stateParams.bucket;
		this.params.path = this.stateParams.path;

		this.initConfig();
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	selectBucket(bucket: DropdownItemPickerModel) {
		if(!bucket) {
			this.resetBucketParams();
			this.resetPathParams(true);

			this.isFormInvalid = true;
			return;
		}

		this.isFormInvalid = false;
		this.params.bucket = bucket.name;

		this.resetPathParams(true);
		this.composePathList(bucket.name);
	}

	selectPath(path: DropdownItemPickerModel) {
		if(!path) {
			this.resetPathParams();
			this.isFormInvalid = true;
			return;
		}

		this.params.path = path.name;
		this.isFormInvalid = false;
		const pathInfo = this.configs
			.filter(e => e.bucket === this.params.bucket)
			.map(item => item.paths.find(e => e.path === this.params.path) || new S3UploaderPathConfigDto())
			.find(e => e.path === this.params.path);

		this.params.validation = pathInfo.validation || false;
		this.params.fileNames = pathInfo.fileNames || null;
		this.params.fileExtension = pathInfo.fileExtension || null;
		this.changed.emit(this.params);
	}

	private initConfig() {
		this.configAllStatuses(true);

		const sub = this.configService
			.getList()
			.subscribe(
				resp => {
					this.configs = resp;
					this.composeBucketList();
					this.configAllStatuses(false);
				},
				err => this.configAllStatuses(false)
			);

		this.sub.add(sub);
	}

	private composeBucketList() {
		const bucketList = this.configs
			.filter(item => item.paths && item.paths.length)
			.map((item, index) => {
				const isChecked = item.bucket === this.params.bucket;
				const bucket = new DropdownItemPickerModel({
					name: `${item.bucket}`,
					value: {name: item.bucket},
					checked: isChecked
				});

				if(isChecked) {
					this.composePathList(item.bucket);
				}

				return bucket;
			});

		this.bucketListSubj.next(bucketList);
		this.bucketListSubj.complete();
	}

	private composePathList(bucket: string) {
		const selectedBucket = this.configs.filter(e => e.bucket === bucket)[0];
		const pathList = selectedBucket.paths.map((item) => {
			const isChecked = item.path === this.params.path;
			const path = new DropdownItemPickerModel({
				name: `${item.path}`,
				value: {name: item.path},
				checked: isChecked
			});

			if(isChecked) {
				this.selectPath(path);
			}

			return path;
		});

		this.pathList.composeData(pathList);
	}


	private configAllStatuses(status: boolean) {
		this.configBucketListStatuses(status);
		this.configPathListStatuses(status);
	}

	private configBucketListStatuses(status: boolean) {
		this.bucketList.loading = status;
		this.bucketList.disabled = status;
	}

	private configPathListStatuses(status: boolean) {
		this.pathList.loading = status;
		this.pathList.disabled = status;
	}

	private clearValidate() {
		this.params.fileExtension = null;
		this.params.fileNames = null;
		this.params.validation = false;
	}

	private resetPathParams(isRemoveItems?: boolean) {
		this.params.path = null;
		this.clearValidate();
		this.changed.emit(this.params);

		if(isRemoveItems) {
			this.pathList.removeItems();
		}
	}

	private resetBucketParams() {
		this.params.bucket = null;
		this.bucketList.reset();
	}
}
