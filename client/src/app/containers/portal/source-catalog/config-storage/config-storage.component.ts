import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';

import { alertsService } from '@components/ui';

import { BucketConfigKey } from '@enums/bucket-config-key.enum';
import { AlertType } from '@enums/alert-type.enum';

import { S3UploaderQueriesDto, S3UploaderService } from '@rest/aws/s3/uploader';
import { DraftConfig } from '@rest/source-catalog/draft-config/draft-config.output.dto';
import {
	Config,
	ConfigStorageItemDto,
	ConfigStorageQueriesDto,
	ConfigStorageService,
	ConfigStorageUpdateDto,
	ConfigStorageUpdateQueriesDto
} from '@rest/config-storage';

import { ModalsService } from './modals/modals.service';
import { ParamsService } from './shared/params.service';
import { ConfigResponseDto } from './shared/config-queries.dto';
import { CSVGenerateService } from './shared/csv-generate.service';

import { ParamsModel } from './config-storage-params.model';
import { DraftConfigFormData } from '@rest/source-catalog/draft-config/draft-config.form.dto';

@Component({
	selector: 'config-storage',
	templateUrl: './config-storage.html',
	styleUrls: ['./config-storage.scss'],
	providers: [
		ModalsService,
		ParamsService,
		ConfigStorageService,
		S3UploaderService,
		CSVGenerateService
	]
})
export class ConfigStorageComponent implements OnInit, OnDestroy {
	private sub = new Subscription();
	private isRouterNavigated = false;

	params: ParamsModel = new ParamsModel();
	config: ConfigStorageItemDto = new ConfigStorageItemDto();
	items: Config[] = [];
	selectedItem: Config = new Config();

	errorMsg = '';
	isShowMoreMatillionMessage = false;
	isCheckingOnUploadFile = false;
	isCheckingOnExecuteFile = false;
	loading = false;

	constructor(
		private router: Router,
		private location: Location,
		private httpClient: HttpClient,
		private modalsService: ModalsService,
		private paramsService: ParamsService,
		private configStorageService: ConfigStorageService,
		private s3UploaderService: S3UploaderService,
		private csvGenerateService: CSVGenerateService
	) {
		this.isRouterNavigated = this.router.navigated;
	}

	ngOnInit() {
		const sub = this.paramsService
			.getParamsSubj()
			.subscribe((params: ParamsModel) => {
				this.composeParams(params);

				if(params.sourceApplication && params.eventId) {
					this.fetch();
				}
			});

		this.sub.add(sub);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

	selectConfig(item: Config) {
		this.selectedItem = item;
	}

	goToBack() {
		this.isRouterNavigated ? this.location.back() : this.router.navigate(['/portal/source-catalog']);
	}

	fetch() {
		this.loading = true;

		const queries = new ConfigStorageQueriesDto({
			sourceApplication: this.params.sourceApplication,
			eventId: this.params.eventId
		});

		const sub = this.configStorageService
			.getList(queries)
			.subscribe(
				data => {
					this.loading = false;

					if(data.length) {
						this.config = data[0];
					}

					this.items = this.config.metadataList || [];
					this.selectedItem = this.config.metadataList.length ? this.getHighlightСonfig(this.config.metadataList) : null;
				},
				e => {
					this.selectedItem = null;
					this.config = new ConfigStorageItemDto(null);
					this.loading = false;
					this.errorMsg = e.error.message;
				}
			);

		this.sub.add(sub);
	}

	openConfigModal() {
		this.modalsService.openViewModal()
			.subscribe(dto => {
				if (dto) {
					this.getDraftConfig(dto);
				}
			});
	}

	getDraftConfig(data: DraftConfigFormData) {
		const configProperty = new DraftConfig();
		configProperty.sourceApplication = this.params.sourceApplication;
		configProperty.eventType = this.params.eventId;
		configProperty.schemaName = data.schemaName;
		configProperty.tableName = data.tableName;
		configProperty.parentEntityName = data.parentEntityName;
		this.modalsService.bsModalRef.content.hideFirstStep();

		this.httpClient.post('api/configuration/draft', [configProperty])
			.subscribe((data: ConfigResponseDto) => {
					this.modalsService.toggleSubmit(false);
					this.modalsService.bsModalRef.content.nextStep(true);
					this.modalsService.bsModalRef.content.setFileDetail(configProperty);
					this.modalsService.bsModalRef.content.setReportDetail(data.status, data.taskReport);
					data.csvQueries ? this.modalsService.bsModalRef.content.setCsvLink(data.csvQueries) : this.modalsService.bsModalRef.content.setCsvLink(null);
					data.sqlQueries ? this.modalsService.bsModalRef.content.setSqlLink(data.sqlQueries) : this.modalsService.bsModalRef.content.setSqlLink(null);
				}
			);
	}

	downloadCSV(config: ConfigStorageItemDto) {
		const content = this.csvGenerateService.convertConfigToCSV(config);
		const fileName = `${config.sourceApplication} ${config.eventId}.csv`;
		const blobFormat = new Blob([content], { type: 'text/csv' });

		saveAs(blobFormat, fileName);
	}

	upload(input: HTMLInputElement) {
		if(!input.files.length) {
			return;
		}

		this.onUpload(input.files[0]);
		input.value = '';
	}

	showMore() {
		this.isShowMoreMatillionMessage = true;
	}

	private onUpload(file: File) {
		this.isCheckingOnUploadFile = true;

		const query = this.createUploadFileQuery(file);
		const sub = this.s3UploaderService
			.upload(query)
			.subscribe(
				event => {
					if(event.type === HttpEventType.Response) {
						this.isCheckingOnUploadFile = false;

						this.updateFromCSV(event.body.key);
					}
				},
				err => {
					alertsService.error(err.message);
				});

		this.sub.add(sub);
	}

	private updateFromCSV(key: string) {
		this.isCheckingOnExecuteFile = true;
		const query = this.createExecuteQueries(key);

		const sub = this.configStorageService
			.updateFromCSV(query)
			.subscribe(
				(response: ConfigStorageUpdateDto) => {
					this.isCheckingOnExecuteFile = false;

					switch(response.status) {
						case AlertType.SUCCESS:
							this.fetch();
							alertsService.success(response.message);
							break;
						case AlertType.ERROR:
							alertsService.error(`${response.message}`);
							break;
					}
				},
				() => {
					this.isCheckingOnExecuteFile = false;
				}
			);

		this.sub.add(sub);
	}

	private createUploadFileQuery(file: File): S3UploaderQueriesDto {
		const formData = new FormData();
		formData.append('file', file);

		return new S3UploaderQueriesDto({
			formData: formData,
			key: 'redshift-dataconfig/storage/' + encodeURIComponent(file.name),
			bucketConfigKey: BucketConfigKey.PIPELINE_CONFIGS,
			url: 'upload',
			autoUpload: true
		});
	}

	private createExecuteQueries(objectKey: string): ConfigStorageUpdateQueriesDto {
		return new ConfigStorageUpdateQueriesDto({
			key: objectKey,
			rsTemplateKey: null,
			enableWarnLevelValidation: true
		});
	}

	private getHighlightСonfig(configs: Config[]): Config {
		const highlightedСonfig = configs.find(item => (item.schemaName === this.selectedItem.schemaName && item.tgTableName === this.selectedItem.tgTableName) || (item.schemaName === this.params.schemaName && item.tgTableName === this.params.tableName));
		return highlightedСonfig || configs[0];
	}

	private composeParams(params: ParamsModel) {
		this.params = params;
	}
}
