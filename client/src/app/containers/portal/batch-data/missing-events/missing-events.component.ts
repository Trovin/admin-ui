import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { Subject, Subscription } from 'rxjs';

import { GalaxyBucket } from '@enums/galaxy-bucket.enum';

import {
	ReconciliationFilesMissingEventsService,
	ReconciliationFilesMissingEventsQueriesDto,
	ReconciliationFileMissingEventsIdsDto, MissingEventsIdsFileDto,
} from '@rest/reconciliation-files/missing-events';

import { BatchDataMissingEventsParamsService } from './shared/params.service';
import { BatchDataMissingEventsParamsModel } from './shared/params.model';
import { S3UrIBuilderUtils } from '@utils/s3-url-builder.utils';

@Component({
	selector: 'batch-data-missing-events',
	templateUrl: './missing-events.html',
	providers: [
		BatchDataMissingEventsParamsService,
		ReconciliationFilesMissingEventsService
	]
})

export class BatchDataMissingEventsComponent implements OnInit, OnDestroy {
	private sub = new Subscription();
	private bucket = '';

	params = new BatchDataMissingEventsParamsModel();
	items: ReconciliationFileMissingEventsIdsDto[] = [];
	s3FilesLinks: string[] = [];
	tableTitles: string[] = [];

	loading = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private service: ReconciliationFilesMissingEventsService,
		private paramsService: BatchDataMissingEventsParamsService
	) {
		const subParamMap = this.route.paramMap
			.subscribe(params => this.setPipelineAlias(params.get('bucket')));
		this.sub.add(subParamMap);
	}

	ngOnInit() {
		const sub = this.paramsService
			.getParamsSubj()
			.subscribe(params => {
				this.composeParams(params);
				this.configUrlParams().subscribe(() => {
					this.fetch();
				});
			});
		this.sub.add(sub);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	fetch() {
		this.loading = true;

		const queries = new ReconciliationFilesMissingEventsQueriesDto({
			objectKey: this.params.objectKey,
			bucketName: this.params.bucketName,
			redshiftTargetSchema: this.params.redshiftTargetSchema,
			redshiftTargetTable: this.params.redshiftTargetTable
		});

		const sub = this.service
			.getList(queries)
			.subscribe(
				resp => {
					const missingIds = resp && resp.missingIds ? resp.missingIds : [];
					const s3Files = resp && resp.missingEventsIdsFiles ? resp.missingEventsIdsFiles : [];
					this.tableTitles = missingIds.length ? Object.keys(missingIds[0]).map(e => e) : [];
					this.items = this.composeTableDataContent(missingIds);
					this.s3FilesLinks = this.composeS3FilesLinks(s3Files);
					this.loading = false;
				},
				() => {
					this.items = [];
					this.tableTitles = [];
					this.loading = false;
				}
			);

		this.sub.add(sub);
	}

	composeTableDataContent(missingIds: ReconciliationFileMissingEventsIdsDto[]) {
		if(!missingIds) {
			return [];
		}
		return missingIds.map((item) => {
			return Object.keys(item)
				.sort((current: string, next: string) => this.tableTitles.indexOf(current) - this.tableTitles.indexOf(next))
				.map((key) => {
					return {
						[key]: item[key]
					};
				}).reduce((obj, item) => {
					const key = Object.keys(item)[0];
					obj[key] = item[key];
					return obj;
				}, {});
		});
	}

	private composeS3FilesLinks(s3Files: MissingEventsIdsFileDto[]) {
		return s3Files.map(file => S3UrIBuilderUtils.buildS3Url(file.bucketName, file.objectKey));
	}

	composeParams(params: BatchDataMissingEventsParamsModel) {
		this.params = params;
	}

	private setPipelineAlias(name: string) {
		const pipeline = GalaxyBucket.getByAlias(name);
		this.bucket = GalaxyBucket.getValues(pipeline).alias;
	}

	private configUrlParams() {
		const subj = new Subject<never>();
		const queryParams: NavigationExtras = {
			queryParams: {
				'objectKey': this.params.objectKey,
				'redshiftTargetSchema': this.params.redshiftTargetSchema,
				'redshiftTargetTable': this.params.redshiftTargetTable,
				'bucketName': this.params.bucketName,
				'page': this.params.page
			},
			relativeTo: this.route,
			replaceUrl: true
		};
		this.router.navigate([`/portal/input-files/${this.bucket}/missing-events`], queryParams).then(() => {
			subj.next();
			subj.complete();
		});

		return subj;
	}
}
