import { Component, Input, OnInit } from '@angular/core';

import { S3UrIBuilderUtils } from '@utils/s3-url-builder.utils';

import {
	AuditOutputStatsBaseDto,
	AuditOutputProcessBaseQueriesDto,
	AuditOutputStatsBaseService
} from '@rest/audit/shared/output-stats-base';

@Component({
	selector: 'batch-output',
	templateUrl: './output.html',
	providers: [AuditOutputStatsBaseService]
})

export class AuditBatchOutputComponent implements OnInit {
	@Input() runId: string;

	items: AuditOutputStatsBaseDto[] = [];

	loading = false;

	constructor(private service: AuditOutputStatsBaseService) {}

	ngOnInit() {
		this.fetch();
	}

	fetch() {
		this.loading = true;

		const queries = new AuditOutputProcessBaseQueriesDto({
			runId: this.runId
		});

		this.service
			.getBaseList(queries, 'batch-output')
			.subscribe(
				resp => {
					this.items = resp;
					this.loading = false;
				},
				() => {
					this.items = [];
					this.loading = false;
				}
			);
	}

	composeS3Url(bucketName: string, objectKey: string) {
		return S3UrIBuilderUtils.buildS3Url(bucketName, objectKey);
	}
}
