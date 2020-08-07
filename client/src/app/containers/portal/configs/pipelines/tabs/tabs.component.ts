import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '@environments/environment';

import { S3UrIBuilderUtils } from '@utils/s3-url-builder.utils';

import { PipelineProcessType } from '@enums/pipeline-process-type.enum';
import { BucketConfigKey } from '@enums/bucket-config-key.enum';

@Component({
	selector: 'auto-conf-tabs',
	templateUrl: './tabs.html'
})

export class AutoConfTabsComponent implements OnInit {
	process = '';
	bucketName = '';

	processType = PipelineProcessType;

	constructor(private router: Router) {}

	ngOnInit() {
		const urlTree = this.router.parseUrl(this.router.url);

		this.bucketName = BucketConfigKey.getBucketName(BucketConfigKey.PIPELINE_CONFIGS, environment.env);
		this.process = urlTree.root.children['primary'].segments
			.map(e => e.path)
			.filter((e, i) => i === 3)[0];
	}

	composeS3Url(bucketName: string) {
		return S3UrIBuilderUtils.buildS3Url(bucketName, null);
	}

	changeTab(process: string) {
		this.process = process;
	}
}
