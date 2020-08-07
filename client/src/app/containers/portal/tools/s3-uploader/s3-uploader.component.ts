import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { PermissionAction } from '@enums/permission-actions.enum';
import { Containers } from '@config/containers.enum';

import { Subject, Subscription } from 'rxjs';

import { S3UploaderRouterStateParamsModel } from './shared/router-state-params.model';
import { S3UploaderRouterStateParamsService } from './shared/router-state.params.service';

import { S3UploaderQueriesModel } from './s3-uploader-queries.model';
import { UploadFiles } from './upload/upload-files/upload-files.component';
import { FileValidateModel, FileValidateResultModel } from './shared/validate/file-validate.model';
import { FormParamsModel } from './form/form-params.model';

@Component({
	selector: 's3-uploader',
	templateUrl: './s3-uploader.html',
	styleUrls: ['./s3-uploader.scss'],
	providers: [
		S3UploaderRouterStateParamsService
	]
})

export class S3UploaderComponent implements OnInit {
	@ViewChild(ModalDirective, {static: true}) modal: ModalDirective;
	@ViewChild(UploadFiles, {static: true}) uploadFiles: UploadFiles;

	params = new S3UploaderQueriesModel();
	uploaderValidate = new FileValidateModel();
	validateResult = new FileValidateResultModel();

	permission = PermissionAction;
	containers = Containers;

	private sub = new Subscription();

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private routerStateParamsService: S3UploaderRouterStateParamsService
	) {}

	ngOnInit() {
		const sub = this.routerStateParamsService
			.getParamsSubj()
			.subscribe((params: S3UploaderRouterStateParamsModel) => {
				this.composeParams(params);
				this.configUrlSubj();
			});

		this.sub.add(sub);
	}

	setFormParams(form: FormParamsModel) {
		this.params.bucket = form.bucket;
		this.params.path = form.path;

		this.uploaderValidate = new FileValidateModel({
			fileExtension: form.fileExtension,
			validation: form.validation,
			fileNames: form.fileNames
		});

		this.validateResult = new FileValidateResultModel();
		this.routerStateParamsService.setParamsSubj(this.params);
	}

	changeListParams(params: S3UploaderRouterStateParamsModel) {
		this.params.sort = params.sort;
		this.params.page = params.page;
		this.params.search = params.search;

		this.routerStateParamsService.setParamsSubj(this.params);
	}

	updateValidateResult(result: FileValidateResultModel) {
		this.validateResult = result;
	}

	openModal() {
		this.modal.show();
	}

	upload(file: File) {
		this.uploadFiles.add(file);
	}

	private composeParams(params: S3UploaderRouterStateParamsModel) {
		this.params = new S3UploaderRouterStateParamsModel(params);
	}

	private configUrlSubj() {
		const subj = new Subject<never>();

		const queryParams: NavigationExtras = {
			queryParams: {
				'page': this.params.page,
				'sort': this.params.sort,
				'search': this.params.search,
				'bucket': this.params.bucket,
				'path': this.params.path
			},
			queryParamsHandling: 'merge',
			relativeTo: this.route,
			replaceUrl: true
		};

		this.router.navigate(['.'], queryParams)
			.then(() => {
				subj.next();
				subj.complete();
			});

		return subj;
	}
}
