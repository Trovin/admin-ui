import { Component, AfterViewInit } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';

import { Subject, Subscription, forkJoin } from 'rxjs';

import { S3UrIBuilderUtils } from '@utils/s3-url-builder.utils';

import { PermissionAction } from '@enums/permission-actions.enum';
import { Containers } from '@config/containers.enum';

import ExpressionDescriptor from 'cronstrue';

import { PaginationService } from '@containers/shared/pagination.service';
import { alertsService } from '@components/ui';

import { ModalsService } from './modal/modals.service';
import { S3BucketDto, S3BucketListService } from '@rest/aws/s3/bucket-list';

import {
	AlarmConfigDto,
	AlarmConfigService,
	AlarmConfigQueriesDto,
	AlarmConfigDeleteQueriesDto,
	AlarmConfigCreateQueriesDto,
	AlarmConfigUpdateQueriesDto,
	AlarmConfigActiveQueriesDto
} from '@rest/alarm-config/index';

import { AlarmDataParamsService } from './shared/params.service';
import { AlarmDataParamsModel } from './alarm-config-data-params.model';

@Component({
	selector: 'alarm-configs',
	templateUrl: './alarm-configs.html',
	providers: [
		AlarmConfigService,
		AlarmDataParamsService,
		PaginationService,
		S3BucketListService,
		ModalsService
	]
})

export class AlarmConfigComponent implements AfterViewInit {
	private sub = new Subscription();

	bucketList: S3BucketDto[] = [];
	bucketListSubj = new Subject<S3BucketDto[]>();

	permission = PermissionAction;
	containers = Containers;

	pagination = new PaginationService();
	timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	params = new AlarmDataParamsModel();
	items: AlarmConfigDto[] = [];
	selectedConfigs: AlarmConfigDto[] = [];
	isSelectedAll = false;
	loading = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private configService: AlarmConfigService,
		private s3BucketListService: S3BucketListService,
		private paramsService: AlarmDataParamsService,
		private modalsService: ModalsService
	) {}

	ngAfterViewInit() {
		const sub = this.paramsService
			.getParamsSubj()
			.subscribe(params => {
				this.composeParams(params);
				this.configUrlParams().subscribe(() => {
					this.initBuckets();
					this.fetch();
				});
			});
		this.sub.add(sub);
	}

	private initBuckets() {
		const sub = this.s3BucketListService
			.getList()
			.subscribe(data => {
				this.composeBucketListData(data);
				this.loading = false;
			});

		this.sub.add(sub);
	}

	performSearch(params: AlarmDataParamsModel) {
		this.params = Object.assign({}, this.params, params);
		this.configPaginationPage(1);
		this.paramsService.setParamsSubj(this.params);
	}

	fetch() {
		this.loading = true;
		const queries = this.composeQueries();
		const sub = this.configService
			.getList(queries)
			.subscribe(
				data => {
					this.loading = false;
					this.items = this.composeConfigs(data.content);
					this.pagination.init(data.pagination);
				},
				() => {
					this.items = [];
					this.loading = false;
				}
			);

		this.sub.add(sub);
	}

	pageChanged(page: number) {
		this.configPaginationPage(page);
		this.configUrlParams();
		this.fetch();
	}

	composeParams(params: AlarmDataParamsModel) {
		this.params = params;
	}

	composeQueries(): AlarmConfigQueriesDto {
		return new AlarmConfigQueriesDto(this.params);
	}

	edit(config: AlarmConfigDto) {
		this.modalsService.openEditModal(config, this.bucketList).subscribe(updatedConfig => {
			this.onEdit(updatedConfig);
		});
	}

	copy(config: AlarmConfigDto) {
		this.modalsService.openCopyModal(config, this.bucketList).subscribe(copyConfig => {
			this.onCopy(copyConfig);
		});
	}

	create() {
		this.modalsService.openCreateModal(this.bucketList).subscribe(config => {
			this.onCreate(config);
		});
	}

	delete(config: AlarmConfigDto) {
		const msg = 'Do you want to confirm the deletion?';

		this.modalsService.openConfirmModal(msg)
			.subscribe((status) => {
				if(status) {
					this.onDelete(config);
				}
			});
	}

	deleteSelected() {
		const msg = `Do you want to confirm the deletion of ${this.selectedConfigs.length} configs?`;

		this.modalsService.openConfirmModal(msg)
			.subscribe(status => {
				if(status) {
					this.onMassDelete();
				}
			});
	}

	selectedAll(target: HTMLInputElement) {
		const selectedList = this.items.map(item => {
			item.selected = target.checked;
			return item;
		});

		this.isSelectedAll = target.checked ? true : false;
		this.selectedConfigs = target.checked ? selectedList : [];
		this.items = selectedList;
	}

	selected(config: AlarmConfigDto, target: HTMLInputElement) {
		this.isSelectedAll = false;
		config.selected = target.checked;
		this.selectedConfigs = this.getSelectedSonfigs();
	}

	switchConfigState(active: boolean, config: AlarmConfigDto) {
		const queries = new AlarmConfigActiveQueriesDto({
			bucket: config.bucket,
			sourcePrefix: encodeURIComponent(config.sourcePrefix),
			active: active
		});

		config.disabled = true;
		config.loading = true;

		this.configService.switchState(queries).subscribe(
			() => {
				config.disabled = false;
				config.active = active;
				config.loading = false;
			},
			() => {
				config.disabled = false;
				config.loading = false;
			}
		);
	}

	composeS3Url(bucketName: string) {
		return S3UrIBuilderUtils.buildS3Url(bucketName, null);
	}

	private configPaginationPage(page: number) {
		this.params.page = page;
		this.pagination.page = page;
	}

	private composeConfigs(resp: AlarmConfigDto[]) {
		return resp.map(config => {
			const cronDescription = ExpressionDescriptor.toString(config.cronExpression, { throwExceptionOnParseError: false, use24HourTimeFormat: true });
			config.cronDescription = cronDescription;

			return new AlarmConfigDto(config);
		});
	}

	private getSelectedSonfigs(): AlarmConfigDto[] {
		const selectedConfigs = this.items.filter(item => item.selected);
		return selectedConfigs;
	}

	private onDelete(config: AlarmConfigDto) {
		const queries = new AlarmConfigDeleteQueriesDto({
			bucket: config.bucket,
			sourcePrefix: encodeURIComponent(config.sourcePrefix)
		});

		this.configService.delete(queries).subscribe(() => {
			this.fetch();
			alertsService.success('Successfully deleted');
		});
	}

	private onMassDelete() {
		this.loading = true;
		const deletingConfigs = this.selectedConfigs.map(config => {
			const queries = new AlarmConfigDeleteQueriesDto({
				bucket: config.bucket,
				sourcePrefix: encodeURIComponent(config.sourcePrefix)
			});

			return this.configService.delete(queries);
		});

		forkJoin(deletingConfigs).subscribe(results => {
			alertsService.success(`Successfully deleted ${deletingConfigs.length} items`);
			this.selectedConfigs = [];
			this.fetch();
			this.loading = false;
		});
	}

	private onEdit(config: AlarmConfigUpdateQueriesDto) {
		const queries = new AlarmConfigUpdateQueriesDto(config);

		this.configService.update(queries).subscribe(() => {
			this.fetch();
			alertsService.success('Successfully edited');
		});
	}

	private onCopy(config: AlarmConfigCreateQueriesDto) {
		const queries = new AlarmConfigCreateQueriesDto(config);

		this.configService.create(queries).subscribe(() => {
			this.fetch();
			alertsService.success('Successfully copied');
		});
	}

	private onCreate(config: AlarmConfigDto) {
		const queries = new AlarmConfigCreateQueriesDto(config);

		this.configService.create(queries).subscribe(() => {
			this.fetch();
			alertsService.success('Successfully created');
		});
	}

	private composeBucketListData(list: S3BucketDto[]) {
		this.bucketList = list;
		this.bucketListSubj.next(list);
		this.bucketListSubj.complete();
	}

	protected configUrlParams() {
		const subj = new Subject<never>();
		const queryParams: NavigationExtras = {
			queryParams: {
				'page': this.params.page,
				'bucket': this.params.bucket,
				'sourcePrefix': this.params.sourcePrefix,
				'status': this.params.status,
				'enabledOnly': this.params.enabledOnly
			},
			queryParamsHandling: 'merge',
			relativeTo: this.route,
			replaceUrl: true
		};
		this.router.navigate(['.'], queryParams).then(() => {
			subj.next();
			subj.complete();
		});

		return subj;
	}
}
