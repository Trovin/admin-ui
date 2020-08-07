import { Component, OnInit, ViewChild, HostListener } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

import { DropdownItemPickerComponent } from '@components/ui/dropdown-item-picker/dropdown-item-picker.component';
import { DropdownItemPickerModel } from '@components/ui/dropdown-item-picker/dropdown-item-picker.model';

import { S3BucketFileDto } from '@rest/aws/s3/bucket-files';
import { S3BucketFilesExecuteQueriesDto } from '@rest/aws/s3/bucket-files-execute';

import { AutoConfigModel } from './../../pipelines-configs.models';

@Component({
	selector: 'execute-modal',
	templateUrl: './execute-modal.html'
})

export class ExecuteModalComponent implements OnInit {
	@ViewChild('templates', {static: true}) templates: DropdownItemPickerComponent;
	@HostListener('document:mousedown', ['$event'])
	onDocumentMouseDown(event) {
		if(event.target.nodeName === 'MODAL-CONTAINER') {
			this.bsModalRef.hide();
		}
	}

	templatesListData: S3BucketFileDto[] = [];
	configs: AutoConfigModel[] = [];
	isOneConfig: boolean;

	executeSubj = new Subject<S3BucketFilesExecuteQueriesDto[]>();

	constructor(public bsModalRef: BsModalRef) {}

	ngOnInit() {
		this.isOneConfig = this.configs.length === 1;
	}

	submit() {
		this.createQueriesList();
		this.bsModalRef.hide();
	}

	cancel() {
		this.bsModalRef.hide();
	}

	private createQueriesList() {
		const queriesList = this.configs.map(item => {
			return new S3BucketFilesExecuteQueriesDto({
				key: item.objectKey,
				rsTemplateKey: this.templatesListData[0].objectKey,
				enableWarnLevelValidation: true
			});
		});

		this.executeSubj.next(queriesList);
	}
}
