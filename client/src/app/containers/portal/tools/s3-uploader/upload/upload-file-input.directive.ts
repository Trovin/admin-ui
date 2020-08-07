import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { FileValidateModel, FileValidateResultModel } from './../shared/validate/file-validate.model';
import { FileValidateService } from './../shared/validate/file-validate.service';

@Directive({
	selector: 'input[uploadFileInput]'
})

export class UploadFileInputDirective {
	@Input('uploadFileInput') uploadFiles: File[] = [];

	@Input() uploadValidation: FileValidateModel = new FileValidateModel();
	@Output() fileValidation = new EventEmitter<FileValidateResultModel>();
	@Output() onUpload = new EventEmitter<File>();

	@HostListener('change') onChange(): void {
		const files = this.element.nativeElement.files;
		if(files.length) {
			for(let i = 0, length = files.length; i < length; i++) {
				const validateResult = this.service.validate(files[i], this.uploadValidation);
				this.fileValidation.emit(validateResult);

				if(!validateResult.isFileExtensionValid || !validateResult.isFileNameValid) {
					return;
				}

				this.onUpload.emit(files[i]);
			}
		}

		this.resetState();
	}

	constructor(
		private element: ElementRef,
		private service: FileValidateService
	) {}

	private resetState() {
		this.element.nativeElement.value = '';
	}
}
