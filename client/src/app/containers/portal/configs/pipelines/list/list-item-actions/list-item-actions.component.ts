import { Component, Output, EventEmitter, Input } from '@angular/core';

import { S3UrIBuilderUtils } from '@utils/s3-url-builder.utils';

import { PermissionAction } from '@enums/permission-actions.enum';
import { Containers } from '@config/containers.enum';

import { environment } from '@environments/environment';

import { BucketConfigKey } from '@enums/bucket-config-key.enum';

import { AutoConfigModel } from './../../pipelines-configs.models';

@Component({
	selector: 'list-item-actions',
	templateUrl: './list-item-actions.html'
})

export class ListItemActionsComponent {
	@Output() execute = new EventEmitter<AutoConfigModel>();
	@Output() download = new EventEmitter<AutoConfigModel>();
	@Output() cleanUp = new EventEmitter<AutoConfigModel>();
	@Output() delete = new EventEmitter<AutoConfigModel>();

	@Input() item: AutoConfigModel;

	permission = PermissionAction;
	containers = Containers;

	composeS3Url(objectKey: string) {
		const bucketName = BucketConfigKey.getBucketName(BucketConfigKey.PIPELINE_CONFIGS, environment.env);
		const uri = `${S3UrIBuilderUtils.buildS3Url(bucketName, objectKey)}`;
		return uri;
	}

	executeFile() {
		this.execute.emit(this.item);
	}

	downloadFile() {
		this.download.emit(this.item);
	}

	cleanUpFile() {
		this.cleanUp.emit(this.item);
	}

	deleteFile() {
		this.delete.emit(this.item);
	}
}
