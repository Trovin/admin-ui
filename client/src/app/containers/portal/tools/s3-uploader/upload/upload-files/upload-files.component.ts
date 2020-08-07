import { Component, QueryList, ContentChildren, forwardRef } from '@angular/core';

import { UploadFileItem } from './upload-file-item/upload-file-item.component';

@Component({
	selector: 'upload-files',
	templateUrl: 'upload-files.component.html',
	styleUrls: ['./upload-files.scss']
})

export class UploadFiles {
	@ContentChildren(forwardRef(() => UploadFileItem)) uploadFiles: QueryList<UploadFileItem>;

	files: File[] = [];

	add(file: File) {
		if(!this.isInProgressUpload(file) || !this.uploadFiles.length) {
			this.files.unshift(file);
		}
	}

	private isInProgressUpload(file: File): boolean {
		const fileUploadingList = this.uploadFiles.filter(item => item.isUploading && file.name == item.file.name);
		return !!fileUploadingList.length;
	}
}
