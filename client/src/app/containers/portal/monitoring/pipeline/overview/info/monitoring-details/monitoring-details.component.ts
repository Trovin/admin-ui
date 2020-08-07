import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Params } from '@angular/router';

import { UserService } from '@core/user/user.service';

import { PermissionAction } from '@enums/permission-actions.enum';
import { Containers } from '@config/containers.enum';

import { Subscription, Subject } from 'rxjs';

import { ParamsService } from '@containers/shared/params.service';

import { PipelineProcessType } from '@enums/pipeline-process-type.enum';
import { PipelinePageType } from '@enums/pipeline-page-type.enum';
import { PipelineType } from '@enums/pipeline-type.enum';
import { Permission } from '@enums/permission.enum';

import {
	PipelineCustomContentService,
	PipelineCustomContentDto,
	PipelineCustomContentQueriesDto
} from '@rest/monitoring-sources/custom-content';


@Component({
	selector: 'pipeline-info-monitoring-details',
	templateUrl: './monitoring-details.html',
	styleUrls: ['./monitoring-details.scss'],
	providers: [PipelineCustomContentService]
})

export class PipelineInfoMonitoringDetailsComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = [];
	private queries: PipelineCustomContentQueriesDto;
	private params: {[key:string]: string} = {};
	private item = new PipelineCustomContentDto();

	dataChanged = new Subject<never>();

	loading = false;
	isEdit = false;

	permissionAction = PermissionAction;
	containers = Containers;

	form = new FormGroup({
		content: new FormControl('')
	});

	permission = Permission;

	constructor(
		private userService: UserService,
		private service: PipelineCustomContentService,
		private paramsService: ParamsService
	) {}

	ngOnInit() {
		const sub = this.paramsService
			.getDataSubj()
			.subscribe((data: Params) => {
				this.params.process = data.process;
				this.params.pipelineAlias = data.pipelineAlias;

				this.resetForm();
				this.composeQueries();
				this.fetch();
			});

		this.subscriptions.push(sub);
	}

	ngOnDestroy() {
		this.subscriptions.forEach(s => s.unsubscribe());
	}

	editToggle() {
		this.isEdit = !this.isEdit;
	}

	cancelEdit() {
		this.patchForm(this.item);
		this.editToggle();
	}

	save() {
		if(this.isContentNotChanged()) {
			this.editToggle();
			return;
		}

		this.loading = true;
		const queries = new PipelineCustomContentQueriesDto(this.queries);
		const sub = this.userService.getUserInfoSubj()
			.subscribe((userInfo) => {
				queries.content = this.form.getRawValue().content;
				queries.userId = userInfo.sub;
				queries.userEmail = userInfo.email;
				queries.userName = userInfo.name;

				const sub = this.service
					.post(this.params.pipelineAlias, this.params.process, queries)
					.subscribe(
						() => {
							this.loading = false;
							this.copyData(this.form.getRawValue());
							this.editToggle();
						},
						() => this.loading = false
					);
				this.subscriptions.push(sub);
			});
		this.subscriptions.push(sub);
	}

	private fetch() {
		this.loading = true;

		const sub = this.service
			.get(this.params.pipelineAlias, this.params.process, this.queries)
			.subscribe(
				(data: PipelineCustomContentDto) => {
					this.loading = false;
					this.patchForm(data);
					this.copyData(data);
				},
				() => this.loading = false
			);

		this.subscriptions.push(sub);
	}

	private isContentNotChanged() {
		return this.form.get('content').value === this.item.content;
	}

	private patchForm(data: PipelineCustomContentDto) {
		const d = data || {};
		this.form.patchValue(d);
	}

	private resetForm() {
		this.isEdit = false;
		this.form.reset();
	}

	private copyData(data: PipelineCustomContentDto) {
		this.item = new PipelineCustomContentDto(data);
	}

	private composeQueries() {
		const customContentKey = PipelineType.getByAlias(this.params.pipelineAlias) + '_' + PipelineProcessType.getByAlias(this.params.process);
		const queries = {
			key: PipelinePageType[customContentKey]
		};

		this.queries = new PipelineCustomContentQueriesDto(queries);
	}
}
