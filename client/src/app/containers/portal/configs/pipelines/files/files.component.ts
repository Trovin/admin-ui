import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterEvent, ActivatedRoute, NavigationEnd } from '@angular/router';

import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { environment } from '@environments/environment';

import { BucketConfigKey } from '@enums/bucket-config-key.enum';

import { S3BucketFilesQueriesDto } from '@rest/aws/s3/bucket-files';

import { AutoConfFilesListComponent } from './../list/list.component';
import { AutoConfFilesFormComponent } from './../form/form.component';
import { AutoConfigActionsListModel } from './../pipelines-configs.models';

@Component({
	selector: 'auto-conf-files',
	templateUrl: './files.html'
})

export class AutoConfFilesComponent implements OnInit, OnDestroy {
	@ViewChild(AutoConfFilesListComponent, {static: true}) list: AutoConfFilesListComponent;
	@ViewChild(AutoConfFilesFormComponent, {static: true}) form: AutoConfFilesFormComponent;

	private sub: Subscription;

	actionsLists = new AutoConfigActionsListModel();

	constructor(
		private router: Router,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		this.configParams();
		this.sub = this.router.events
			.pipe(
				filter((event: RouterEvent) => event instanceof NavigationEnd),
				map(() => this.route)
			)
			.subscribe(
				() => this.perform()
			);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	perform() {
		this.configParams();
		this.list.resetPage();
		this.list.fetch();
	}

	downloadSelected() {
		this.list.downloadSelectedFiles();
	}

	executeSelected() {
		this.list.executeSelectedFiles();
	}

	private configParams() {
		const type: string = this.route.snapshot.url[0].path;

		const bucketName = BucketConfigKey.getBucketName(BucketConfigKey.PIPELINE_CONFIGS, environment.env);
		const source = type + '-dataconfig';
		this.form.configS3Params(bucketName, source);

		const params: S3BucketFilesQueriesDto = Object.assign({}, this.form.params, { type });
		this.list.configParams(params);
	}
}
