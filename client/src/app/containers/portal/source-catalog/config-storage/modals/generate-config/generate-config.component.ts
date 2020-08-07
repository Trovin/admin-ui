import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';

import { ModalActionsEnum } from '@components/ui/modal-v2/modal-actions.enum';
import { CreatedFile } from '@containers/portal/source-catalog/config-storage/shared/created-file.dto';
import { S3DownloadFileQueriesDto } from '@rest/config-storage/downloadFileQueries.dto';
import { HttpClient } from '@angular/common/http';
import { DraftConfig } from '@rest/source-catalog/draft-config/draft-config.output.dto';
import { ConfigStatus } from '@enums/config-status.enum';

@Component({
	selector: 'generate-config-modal',
	templateUrl: './generate-config.html',
	styleUrls: ['./generate-config.scss']
})

export class ConfigStorageGenerateConfigModalComponent implements OnInit, OnDestroy {

	configStatusEnum = ConfigStatus;

	csvFile = new CreatedFile();
	sqlFile = new CreatedFile();

	sourceApplication: string;
	eventType: string;

	csvData: S3DownloadFileQueriesDto;
	sqlData: S3DownloadFileQueriesDto;
	configStatus: string;
	configReport: string;

	showFirstStep = true;
	showSecondStep = false;

	private subj = new Subscription();

	modalActions = ModalActionsEnum;
	confirmed = new Subject<any>();

	form: FormGroup;

	submitted = false;

	constructor(
		public bsModalRef: BsModalRef,
		private formBuilder: FormBuilder,
		private httpClient: HttpClient
	) {
		this.createForm();
	}

	ngOnInit() {}

	hideFirstStep() {
		this.showFirstStep = false;
	}

	setFileDetail(config: DraftConfig) {
		this.sourceApplication = config.sourceApplication;
		this.eventType = config.eventType;
	}

	nextStep(status: boolean) {
		this.showSecondStep = status;
	}


	prev() {
		this.showFirstStep = true;
		this.showSecondStep = false;
	}

	next() {
		this.showFirstStep = false;
		this.showSecondStep = true;
	}

	setCsvLink(link: S3DownloadFileQueriesDto) {
		this.csvData = link;
	}

	setSqlLink(link: S3DownloadFileQueriesDto) {
		this.sqlData = link;
	}

	setReportDetail(status: string, text: string) {
		this.configStatus = status;
		this.configReport = text;
	}

	submit() {
		this.toggleSubmit(true);

		if(this.form.invalid) {
			this.toggleSubmit(false);
			this.form.markAllAsTouched();
			return;
		}

		this.confirmed.next(this.form.getRawValue());
	}

	ngOnDestroy() {
		this.subj.unsubscribe();
	}

	reset() {
		this.form.reset();
	}

	closeModal() {
		this.confirmed.complete();
		this.bsModalRef.hide();
		this.subj.unsubscribe();
	}

	toggleSubmit(status: boolean) {
		this.submitted = status;
	}

	saveCsvFile(fileData: S3DownloadFileQueriesDto, file: CreatedFile) {
		if(file.body) {
			saveAs(file.body, file.name);
			return;
		}

		const type = 'csv';
		this.bsModalRef.content.toggleSubmit(true);

		this.getFileFromBucket(fileData)
			.subscribe(responseFile => {
				this.processedFile(file, type, responseFile);
				this.bsModalRef.content.toggleSubmit(false);
			});
	}

	saveSqlFile(fileData: S3DownloadFileQueriesDto, file: CreatedFile) {
		if(file.body) {
			saveAs(file.body, file.name);
			return;
		}

		const type = 'sql';
		this.bsModalRef.content.toggleSubmit(true);

		this.getFileFromBucket(fileData)
			.subscribe(responseFile => {
				this.processedFile(file, type, responseFile);
				this.bsModalRef.content.toggleSubmit(false);
			});
	}

	processedFile(file: CreatedFile, type: string, responseFile: string) {
		file.name = `${this.sourceApplication} ${this.eventType}.${type}`;
		file.body = new Blob([responseFile], {type: `text/${type}`});

		saveAs(file.body, file.name);
	}

	private getFileFromBucket(fileData: S3DownloadFileQueriesDto) {
		const resource = 'api/configuration/draft/file';
		return this.httpClient.post(resource, fileData, {responseType:'text'});
	}

	private createForm() {
		this.form = this.formBuilder.group({
			schemaName: ['', Validators.required],
			tableName: ['', Validators.required],
			parentEntityName: ['']
		});
	}
}
