import { Directive, HostListener, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import { FileValidateModel, FileValidateResultModel } from '../shared/validate/file-validate.model';
import { FileValidateService } from './../shared/validate/file-validate.service';

@Directive({
	selector: 'div[uploadDragAndDrop]'
})

export class UploadDragAndDropDirective {
	@Input('uploadDragAndDrop') uploadFiles:File[] = [];

	@Input() disabled = false;
	@Input() uploadValidation: FileValidateModel = new FileValidateModel();
	@Output() fileValidation = new EventEmitter<FileValidateResultModel>();
	@Output() onUpload = new EventEmitter<File>();


	@HostBinding('class.onDrag') private onDrag = false;
	@HostListener('dragover', ['$event']) onDragOver(event) {
		this.preventEvent(event);

		if(this.disabled) {
			return;
		}

		this.onDrag = true;
	}

	@HostListener('dragleave', ['$event']) onDragLeave(event) {
		this.preventEvent(event);

		if(this.disabled) {
			return;
		}

		this.onDrag = false;
	}

	@HostListener('drop', ['$event']) onDrop(event) {
		this.preventEvent(event);

		if(this.disabled) {
			return;
		}

		this.onDrag = false;

		const files = event.dataTransfer.files as File[];
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
	}

	constructor(private service: FileValidateService) {}

	private preventEvent(event: Event) {
		event.preventDefault();
		event.stopPropagation();
	}
}
