import { Component, AfterViewInit, Output, Input, EventEmitter } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { Subject, forkJoin } from 'rxjs';

import { saveAs } from 'file-saver';

import { BucketConfigKey } from '@enums/bucket-config-key.enum';
import { SortDirection } from '@enums/sort-direction.enum';
import { AutoConfigColumnTypeEnum } from '@enums/auto-conf-column-type.enum';
import { AlertType } from '@enums/alert-type.enum';

import { PaginationService } from '@containers/shared/pagination.service';

import { alertsService } from '@components/ui/index';

import { ModalsService } from './../modal/modals.service';

import { S3BucketFileDto, S3BucketFilesQueriesDto, S3BucketFilesService } from '@rest/aws/s3/bucket-files';
import { S3DownloadQueriesDto, S3DownloadService } from '@rest/aws/s3/download';
import { S3DeleteFileQueriesDto, S3DeleteFileService } from '@rest/aws/s3/delete';
import { S3BucketFilesExecuteDto, S3BucketFilesExecuteQueriesDto, S3BucketFilesExecuteService } from '@rest/aws/s3/bucket-files-execute';
import { S3BucketFilesCleanupQueriesDto, S3BucketFilesCleanupService } from '@rest/aws/s3/bucket-files-cleanup';

import { AutoConfigModel, AutoConfigActionsListModel } from './../pipelines-configs.models';
import { BaseResponseDto } from '@rest/shared/base-response.dto';

@Component({
	selector: 'auto-conf-files-list',
	templateUrl: './list.html',
	providers: [
		S3BucketFilesService,
		S3BucketFilesExecuteService,
		S3DownloadService,
		S3BucketFilesCleanupService,
		S3DeleteFileService,
		PaginationService
	]
})

export class AutoConfFilesListComponent implements AfterViewInit {
	@Output() actions = new EventEmitter<AutoConfigActionsListModel>();
	@Input() actionsLists: AutoConfigActionsListModel;

	items: AutoConfigModel[] = [];
	isSelectedAll = false;

	params = new S3BucketFilesQueriesDto();
	sortSubj = new Subject<string>();

	autoConfigColumnType = AutoConfigColumnTypeEnum;

	templates: S3BucketFileDto[] = [];
	timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	loading = false;

	constructor(
		private service: S3BucketFilesService,
		private executeService: S3BucketFilesExecuteService,
		private cleanupService: S3BucketFilesCleanupService,
		private downloadService: S3DownloadService,
		private deleteService: S3DeleteFileService,
		public pagination: PaginationService,
		private modalsService: ModalsService
	) {}

	ngAfterViewInit() {
		this.configParams();
		this.configSortBy(this.params.sort);
		this.fetch();
	}

	fetch(resetPage?: boolean) {
		if(resetPage) {
			this.pagination.resetPage();
		}

		this.loading = true;
		this.isSelectedAll = false;
		this.actionsLists.selectedList = [];

		const queries = this.composeQueries();

		this.service
			.getList(queries, 'bucket-files')
			.subscribe(
				data => {
					this.loading = false;
					this.onFetch(data.content);
					this.pagination.init(data.pagination);
				},
				() => {
					this.items = [];
					this.loading = false;
				}
			);
	}

	resetPage() {
		this.pagination.page = 1;
		this.params.page = 1;
	}

	onFetch(list: S3BucketFileDto[]) {
		this.templates = list.filter(i => this.isFileTemplate(i));
		this.items = list
			.filter(i => !this.isFileTemplate(i))
			.map(i => {
				const d = new AutoConfigModel(i);
				d.template = !!this.templates.length ? this.templates[0].objectKey : null;
				return d;
			});
	}

	executeFiles(files: AutoConfigModel[]) {
		const filesToExecute = files.filter(items => !items.process);

		this.modalsService.openExecuteModal(filesToExecute, this.templates).subscribe(queries => {
			// @TODO: need to implement on API side
			queries.length === 1 ? this.onExecute(filesToExecute[0], queries[0]) : this.onMassExecute(filesToExecute, queries);
		});
	}

	executeSelectedFiles() {
		this.executeFiles(this.getSelectedItems());
	}

	cleanUpFile(file: AutoConfigModel) {
		const msg = `Please confirm the cleanup from DynamoDb for source app and event type described in <span class="text-primary bold">${file.objectKey}</span>.`;
		this.modalsService.openConfirmModal(msg)
			.subscribe(status => {
				if(status) {
					this.onCleanUp(file);
				}
			});
	}

	downloadFile(config: AutoConfigModel) {

		this.actionsLists.downloadList.push(config);
		const queries = new S3DownloadQueriesDto({
			tool: BucketConfigKey.PIPELINE_CONFIGS,
			key: encodeURIComponent(config.objectKey)
		});

		this.downloadService
			.downloadFile(queries, 'download')
			.subscribe(
				event => {
					if(event.type === HttpEventType.Response) {
						alertsService.success('Successfully download');
						this.actionsLists.downloadList = this.deleteItemsFromList(this.actionsLists.downloadList, [config]);

						const fileName = config.objectKey.split('/').pop();
						const data = event.body as Blob;
						saveAs(data, fileName);
					}
				},
				() => {
					this.actionsLists.downloadList = this.deleteItemsFromList(this.actionsLists.downloadList, [config]);
				}
			);
	}

	downloadSelectedFiles() {
		const configs = this.getSelectedItems();
		this.actionsLists.downloadList = [...this.actionsLists.downloadList, ...configs];

		const keyList = configs.map(item => encodeURIComponent(item.objectKey)).join(',');

		const queries = new S3DownloadQueriesDto({
			tool: BucketConfigKey.PIPELINE_CONFIGS,
			key: keyList,
			zip: 'true'
		});

		this.downloadService
			.downloadFile(queries, 'download-zip')
				.subscribe(
					event => {
						if(event.type === HttpEventType.Response) {
							alertsService.success(`Successfully download ${configs.length} configs`);
							this.actionsLists.downloadList = this.deleteItemsFromList(this.actionsLists.downloadList, configs);

							const data = event.body as Blob;
							saveAs(data, 'PipelineConfig.zip');
						}
					},
					() => {
						this.actionsLists.downloadList = this.deleteItemsFromList(this.actionsLists.downloadList, configs);
					}
				);
	}

	deleteFile(config: AutoConfigModel) {
		const msg = `
			Please confirm the deletion of file <span class="text-primary bold inline-block">${config.objectKey}</span> from S3.
			<p>Note that configuration will not be removed from DynamoDb.</p> <p>To remove from DynamoDb please use Cleanup action</p>
		`;

		this.modalsService.openConfirmModal(msg)
			.subscribe(status => {
				if(status) {
					this.onDelete(config);
				}
			});
	}

	selectedFile(file: AutoConfigModel, target: HTMLInputElement) {
		this.isSelectedAll = false;
		file.selected = target.checked;
		this.actionsLists.selectedList = this.getSelectedItems();
	}

	selectedAllFiles(target: HTMLInputElement) {
		const selectedList = this.items.map(item => {
			item.selected = target.checked;
			return item;
		});

		this.isSelectedAll = target.checked ? true : false;
		this.actionsLists.selectedList = target.checked ? selectedList : [];
		this.items = selectedList;
	}

	pageChanged(page: number) {
		this.params.page = page;
		this.pagination.setPage(page); // @TODO: temporary fix for pagination
		this.fetch();
	}

	configParams(params?: S3BucketFilesQueriesDto) {
		const sort = this.params.sort;
		this.params = Object.assign({}, this.params, params, {sort});
	}

	changedSortBy(sort: string) {
		this.configSortBy(sort);
		this.params.page = 1;
		this.pagination.setPage(this.params.page);
		this.configParams(this.params);
		this.fetch();
	}

	private getSelectedItems(): AutoConfigModel[] {
		return this.items.filter(item => item.selected && !item.process);
	}

	private setInProcessStatusToItems(configs: AutoConfigModel[], status: boolean): AutoConfigModel[] {
		const list = this.items.map(item => {
			const hasConfig = configs.some(config => config.objectKey === item.objectKey);
			if(hasConfig) {
				item.process = status;
			}
			return item;
		});

		return list;
	}

	private deleteItemsFromList(configs: AutoConfigModel[], deleteItemsList: AutoConfigModel[]): AutoConfigModel[] {
		return configs.filter(item => !deleteItemsList.some(config => config.objectKey === item.objectKey));
	}

	private onExecute(config: AutoConfigModel, query: S3BucketFilesExecuteQueriesDto) {
		config.process = true;
		this.actionsLists.executeList.push(config);

		this.executeService
			.post(query)
			.subscribe(
				(response: S3BucketFilesExecuteDto) => {
					config.process = false;
					this.actionsLists.executeList = this.deleteItemsFromList(this.actionsLists.executeList, [config]);

					switch(response.status) {
						case AlertType.SUCCESS:
							alertsService.success(response.message);
							break;
						case AlertType.ERROR:
							alertsService.error(`${response.objectKey} ${response.message}`);
							break;
						case AlertType.WARN:
							this.confirmIgnoreErrors([response], [query]);
							break;
					}
				},
				() => {
					this.actionsLists.executeList = this.deleteItemsFromList(this.actionsLists.executeList, [config]);
					config.process = false;
				}
			);
	}

	private onMassExecute(configs: AutoConfigModel[], queries: S3BucketFilesExecuteQueriesDto[]) {
		this.items = this.setInProcessStatusToItems(configs, true);

		this.actionsLists.executeList = [...this.actionsLists.executeList, ...configs];

		const executingProcesses = queries.map(query => this.executeService.post(query));

		// @TODO: need to implement on API side
		forkJoin(executingProcesses)
			.subscribe(
				(response: S3BucketFilesExecuteDto[]) => {
					this.items = this.setInProcessStatusToItems(configs, false);
					this.actionsLists.executeList = this.deleteItemsFromList(this.actionsLists.executeList, configs);
					this.processingMassExecutingResponse(response, queries);
				},
				() => {
					this.items = this.setInProcessStatusToItems(configs, false);
					this.actionsLists.executeList = this.deleteItemsFromList(this.actionsLists.executeList, configs);
				}
			);
	}

	private processingMassExecutingResponse(data: S3BucketFilesExecuteDto[], queries: S3BucketFilesExecuteQueriesDto[]) {
		const successList = data.filter(item => item.status === AlertType.SUCCESS);
		const errorsList = data.filter(item => item.status === AlertType.ERROR);
		const warningsList = data.filter(item => item.status === AlertType.WARN);

		if(successList.length) {
			alertsService.success(`Successfully updated ${successList.length} configurations`);
		}

		if(errorsList.length) {
			errorsList.forEach(item => alertsService.error(`${item.objectKey} ${item.message}`));
		}

		if(warningsList.length) {
			this.confirmIgnoreErrors(warningsList, queries);
		}
	}

	private confirmIgnoreErrors(filesWithErrors: S3BucketFilesExecuteDto[], queries: S3BucketFilesExecuteQueriesDto[]) {
		this.modalsService.openIgnoreErrorsModal(filesWithErrors)
			.subscribe(status => {
				if(status) {
					const updatedQueries = queries
						.filter(item => filesWithErrors.some(file => file.objectKey === item.key))
						.map(item => {
							item.enableWarnLevelValidation = false;
							return item;
						});

					filesWithErrors.length > 1 ? this.onMassExecute(filesWithErrors, updatedQueries) : this.onExecute(filesWithErrors[0], queries[0]);
				}
			});
	}

	private onCleanUp(config:AutoConfigModel) {
		config.process = true;
		this.actionsLists.executeList.push(config);

		const queries = new S3BucketFilesCleanupQueriesDto({
			key: config.objectKey,
			rsTemplateKey: config.template
		});

		this.cleanupService
			.post(queries)
			.subscribe(
				(r: BaseResponseDto) => {
					config.process = false;
					this.actionsLists.executeList = this.deleteItemsFromList(this.actionsLists.executeList, [config]);

					alertsService.success(r.message);
				},
				() => {
					this.actionsLists.executeList = this.deleteItemsFromList(this.actionsLists.executeList, [config]);
					config.process = false;
				}
			);
	}

	private onDelete(config: AutoConfigModel) {
		config.process = true;

		const queries = new S3DeleteFileQueriesDto({
			tool: BucketConfigKey.PIPELINE_CONFIGS,
			key: encodeURIComponent(config.objectKey)
		});

		this.deleteService
			.delete(queries)
			.subscribe(() => {
				alertsService.success('Successfully deleted');
				this.fetch();
			});
	}

	private configSortBy(sort: string) {
		const sortBy = sort || this.createDefaultSortBy();
		this.params.sort = sortBy;
		this.sortSubj.next(sortBy);
	}

	private createDefaultSortBy() {
		return `${this.autoConfigColumnType.DATE},${SortDirection.DESC}`;
	}

	composeQueries() {
		return new S3BucketFilesQueriesDto(this.params);
	}

	private isFileTemplate(i: S3BucketFileDto) {
		const fileFormat = '.st';
		return fileFormat === (!!~i.objectKey.lastIndexOf('.') ? i.objectKey.substring(i.objectKey.lastIndexOf('.')) : '');
	}
}
